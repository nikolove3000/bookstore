package com.thanh.bookstore.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.AdminOrderDto;
import com.thanh.bookstore.dto.OrderItemDto;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Order;
import com.thanh.bookstore.entity.OrderItem;
import com.thanh.bookstore.entity.enums.OrderStatus;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.OrderRepository;

/**
 * Service for admin order management operations.
 */
@Service
@Transactional(readOnly = true)
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Returns paginated list of all orders, optionally filtered by status.
     *
     * @param status   filter by status — null returns all orders
     * @param pageable pagination parameters
     */
    public Page<AdminOrderDto> getAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> orders = status != null
                ? orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                : orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return orders.map(this::toDto);
    }

    /**
     * Returns full detail of a single order.
     *
     * @throws ResourceNotFoundException if the order doesn't exist
     */
    public AdminOrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return toDto(order);
    }

    // ── private ──────────────────────────────────────────

    private AdminOrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getOrderItems().stream()
                .map(this::toItemDto)
                .toList();

        AdminOrderDto dto = new AdminOrderDto();
        dto.setId(order.getId());
        dto.setUsername(order.getUser().getUsername());
        dto.setEmail(order.getUser().getEmail());
        dto.setItems(items);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setStatus(order.getStatus());
        dto.setPaid(order.isPaid());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItemCount(order.getOrderItems().size());
        return dto;
    }

    private OrderItemDto toItemDto(OrderItem item) {
        Book book = item.getBook();
        BigDecimal subtotal = item.getUnitPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        OrderItemDto dto = new OrderItemDto();
        dto.setBookId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setCoverUrl(book.getCoverUrl());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(subtotal);
        return dto;
    }
}