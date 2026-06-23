package com.thanh.bookstore.controller;

import com.thanh.bookstore.dto.AddToCartRequest;
import com.thanh.bookstore.dto.CartDto;
import com.thanh.bookstore.dto.UpdateQuantityRequest;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.service.CartService;
import com.thanh.bookstore.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for shopping cart endpoints.
 *
 * <p>All endpoints require authentication — the cart always
 * belongs to the currently logged-in user.</p>
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    /**
     * GET /api/cart
     * Returns the current user's cart, creating one if it doesn't exist.
     */
    @GetMapping
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(cartService.getCart(currentUser()));
    }

    /**
     * POST /api/cart/items
     * Adds a book to the current user's cart.
     */
    @PostMapping("/items")
    public ResponseEntity<CartDto> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(currentUser(), request));
    }

    /**
     * PUT /api/cart/items/{itemId}
     * Updates the quantity of a cart item.
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateQuantity(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateQuantityRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(currentUser(), itemId, request));
    }

    /**
     * DELETE /api/cart/items/{itemId}
     * Removes a single item from the cart.
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(currentUser(), itemId));
    }

    /**
     * DELETE /api/cart
     * Clears all items from the current user's cart.
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart(currentUser());
        return ResponseEntity.noContent().build();
    }

    // ── private ──────────────────────────────────────────

    /** Resolves the authenticated user from the security context. */
    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}