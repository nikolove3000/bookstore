package com.thanh.bookstore.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.CheckoutRequest;
import com.thanh.bookstore.dto.OrderDto;
import com.thanh.bookstore.dto.OrderItemDto;
import com.thanh.bookstore.dto.OrderSummaryDto;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Cart;
import com.thanh.bookstore.entity.CartItem;
import com.thanh.bookstore.entity.Order;
import com.thanh.bookstore.entity.OrderItem;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.enums.OrderStatus;
import com.thanh.bookstore.exception.EmptyCartException;
import com.thanh.bookstore.exception.InsufficientStockException;
import com.thanh.bookstore.exception.InvalidOrderStateException;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.BookRepository;
import com.thanh.bookstore.repository.CartRepository;
import com.thanh.bookstore.repository.OrderRepository;

/**
 * Service for order checkout and order history operations.
 */
@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository,
            CartRepository cartRepository,
            BookRepository bookRepository,
            CartService cartService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.cartService = cartService;
    }

    /**
     * Places an order from the user's current cart.
     *
     * <p>
     * Validates stock for every item, decrements stock, snapshots unit prices,
     * creates the order, and clears the cart — all atomically.</p>
     *
     * @throws EmptyCartException if the cart has no items
     * @throws InsufficientStockException if any item exceeds available stock
     */
    public OrderDto checkout(User user, CheckoutRequest request) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .filter(c -> !c.getCartItems().isEmpty())
                .orElseThrow(() -> new EmptyCartException("Your cart is empty"));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(OrderStatus.PENDING);

        order.setPaid(true);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            Book book = cartItem.getBook();
            int quantity = cartItem.getQuantity();

            if (book.getStockQuantity() == null || book.getStockQuantity() < quantity) {
                throw new InsufficientStockException(
                        "Only " + book.getStockQuantity() + " copies of \"" + book.getTitle() + "\" left in stock");
            }

            book.setStockQuantity(book.getStockQuantity() - quantity);
            bookRepository.save(book);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setBook(book);
            item.setQuantity(quantity);
            item.setUnitPrice(book.getPrice());
            orderItems.add(item);

            total = total.add(book.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        cartService.clearCart(user);

        return toDto(saved);
    }

    /**
     * Returns paginated order history for a user, most recent first.
     */
    @Transactional(readOnly = true)
    public Page<OrderSummaryDto> getOrderHistory(User user, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::toSummaryDto);
    }

    /**
     * Returns full detail of a single order.
     *
     * @throws ResourceNotFoundException if the order doesn't exist or doesn't
     * belong to the given user
     */
    @Transactional(readOnly = true)
    public OrderDto getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        }
        return toDto(order);
    }

    // ── private ──────────────────────────────────────────
    private OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getOrderItems().stream()
                .map(this::toItemDto)
                .toList();

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setItems(items);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setStatus(order.getStatus());
        dto.setPaid(order.isPaid());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    private OrderItemDto toItemDto(OrderItem item) {
        Book book = item.getBook();
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        OrderItemDto dto = new OrderItemDto();
        dto.setBookId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setCoverUrl(book.getCoverUrl());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(subtotal);
        return dto;
    }

    private OrderSummaryDto toSummaryDto(Order order) {
        String previewCover = order.getOrderItems().isEmpty()
                ? null
                : order.getOrderItems().get(0).getBook().getCoverUrl();

        OrderSummaryDto dto = new OrderSummaryDto();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaid(order.isPaid());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItemCount(order.getOrderItems().size());
        dto.setPreviewCoverUrl(previewCover);
        return dto;
    }

    /**
     * Cancels an order and restocks its items.
     *
     * @throws ResourceNotFoundException if the order doesn't exist or doesn't
     * belong to the given user
     * @throws InvalidOrderStateException if the order is no longer PENDING
     */
    public OrderDto cancelOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found: " + orderId);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStateException(
                    "Order can no longer be cancelled — current status: " + order.getStatus());
        }

        for (OrderItem item : order.getOrderItems()) {
            Book book = item.getBook();
            book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
            bookRepository.save(book);
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        return toDto(saved);
    }
}
