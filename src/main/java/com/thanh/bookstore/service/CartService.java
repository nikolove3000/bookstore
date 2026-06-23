package com.thanh.bookstore.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.AddToCartRequest;
import com.thanh.bookstore.dto.CartDto;
import com.thanh.bookstore.dto.CartItemDto;
import com.thanh.bookstore.dto.UpdateQuantityRequest;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Cart;
import com.thanh.bookstore.entity.CartItem;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.exception.InsufficientStockException;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.BookRepository;
import com.thanh.bookstore.repository.CartItemRepository;
import com.thanh.bookstore.repository.CartRepository;

/**
 * Service for shopping cart operations.
 */
@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;

    public CartService(CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Returns the cart for a user, creating an empty one if none exists.
     */
    @Transactional(readOnly = true)
    public CartDto getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return toDto(cart);
    }

    /**
     * Adds a book to the user's cart, or increases quantity if already present.
     *
     * @throws ResourceNotFoundException   if the book does not exist
     * @throws InsufficientStockException  if requested quantity exceeds stock
     */
    public CartDto addToCart(User user, AddToCartRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + request.getBookId()));

        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findByCartIdAndBookId(cart.getId(), book.getId())
                .orElse(null);

        int newQuantity = (item != null ? item.getQuantity() : 0) + request.getQuantity();
        validateStock(book, newQuantity);

        if (item != null) {
            item.setQuantity(newQuantity);
        } else {
            item = new CartItem();
            item.setCart(cart);
            item.setBook(book);
            item.setQuantity(newQuantity);
            cart.getCartItems().add(item);
        }
        cartItemRepository.save(item);

        return toDto(cart);
    }

    /**
     * Updates the quantity of an existing cart item.
     *
     * @throws ResourceNotFoundException   if the item doesn't exist or doesn't belong to the user
     * @throws InsufficientStockException  if requested quantity exceeds stock
     */
    public CartDto updateQuantity(User user, Long itemId, UpdateQuantityRequest request) {
        CartItem item = getOwnedItem(user, itemId);
        validateStock(item.getBook(), request.getQuantity());
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        return toDto(item.getCart());
    }

    /**
     * Removes a single item from the user's cart.
     *
     * @throws ResourceNotFoundException if the item doesn't exist or doesn't belong to the user
     */
    public CartDto removeItem(User user, Long itemId) {
        CartItem item = getOwnedItem(user, itemId);
        Cart cart = item.getCart();
        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);
        return toDto(cart);
    }

    /**
     * Removes all items from the user's cart.
     */
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    // ── private ──────────────────────────────────────────

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setCreatedAt(LocalDateTime.now());
                    return cartRepository.save(cart);
                });
    }

    /** Finds a cart item by ID and verifies it belongs to the given user's cart. */
    private CartItem getOwnedItem(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item not found: " + itemId);
        }
        return item;
    }

    private void validateStock(Book book, int requestedQuantity) {
        if (book.getStockQuantity() == null || requestedQuantity > book.getStockQuantity()) {
            throw new InsufficientStockException(
                    "Only " + book.getStockQuantity() + " copies of \"" + book.getTitle() + "\" left in stock");
        }
    }

    private CartDto toDto(Cart cart) {
        List<CartItemDto> items = cart.getCartItems().stream()
                .map(this::toItemDto)
                .toList();

        int totalItems = items.stream().mapToInt(CartItemDto::getQuantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setItems(items);
        dto.setTotalItems(totalItems);
        dto.setTotalPrice(totalPrice);
        return dto;
    }

    private CartItemDto toItemDto(CartItem item) {
        Book book = item.getBook();
        BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setBookId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthorName(book.getAuthor() != null ? book.getAuthor().getName() : null);
        dto.setCoverUrl(book.getCoverUrl());
        dto.setPrice(book.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(subtotal);
        dto.setInStock(book.getStockQuantity() != null && book.getStockQuantity() >= item.getQuantity());
        return dto;
    }
}