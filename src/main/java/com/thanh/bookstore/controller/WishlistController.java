package com.thanh.bookstore.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.WishlistItemDto;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.service.UserService;
import com.thanh.bookstore.service.WishlistService;

/**
 * REST controller for wishlist operations.
 *
 * <p>All endpoints require authentication.</p>
 */
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    /**
     * GET /api/wishlist
     * Returns paginated wishlist for the current user.
     */
    @GetMapping
    public ResponseEntity<Page<WishlistItemDto>> getWishlist(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(wishlistService.getWishlist(currentUser(), pageable));
    }

    /**
     * POST /api/wishlist/{bookId}
     * Adds a book to the current user's wishlist (idempotent).
     */
    @PostMapping("/{bookId}")
    public ResponseEntity<WishlistItemDto> addToWishlist(@PathVariable Long bookId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(currentUser(), bookId));
    }

    /**
     * DELETE /api/wishlist/{bookId}
     * Removes a book from the current user's wishlist.
     */
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long bookId) {
        wishlistService.removeFromWishlist(currentUser(), bookId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/wishlist/{bookId}/check
     * Returns whether a book is in the current user's wishlist.
     */
    @GetMapping("/{bookId}/check")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@PathVariable Long bookId) {
        boolean saved = wishlistService.isInWishlist(currentUser(), bookId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    // ── private ──────────────────────────────────────────

    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}