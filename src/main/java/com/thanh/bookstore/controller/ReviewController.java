package com.thanh.bookstore.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.CreateReviewRequest;
import com.thanh.bookstore.dto.ReviewDto;
import com.thanh.bookstore.dto.ReviewEligibilityDto;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.service.ReviewService;
import com.thanh.bookstore.service.UserService;

import jakarta.validation.Valid;

/**
 * REST controller for review creation, editing, and deletion.
 *
 * <p>All endpoints require authentication. Creating a review also
 * requires a verified purchase of the book.</p>
 */
@RestController
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    /**
     * GET /api/books/{bookId}/review-eligibility
     * Tells the current user whether they can review this book,
     * and returns their existing review if one was already posted.
     */
    @GetMapping("/api/books/{bookId}/review-eligibility")
    public ResponseEntity<ReviewEligibilityDto> checkEligibility(@PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.checkEligibility(currentUser(), bookId));
    }

    /**
     * POST /api/books/{bookId}/reviews
     * Creates a review for a book the current user has purchased.
     */
    @PostMapping("/api/books/{bookId}/reviews")
    public ResponseEntity<ReviewDto> createReview(
            @PathVariable Long bookId,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(currentUser(), bookId, request));
    }

    /**
     * PUT /api/reviews/{id}
     * Updates the current user's own review.
     */
    @PutMapping("/api/reviews/{id}")
    public ResponseEntity<ReviewDto> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(currentUser(), id, request));
    }

    /**
     * DELETE /api/reviews/{id}
     * Deletes the current user's own review.
     */
    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(currentUser(), id);
        return ResponseEntity.noContent().build();
    }

    // ── private ──────────────────────────────────────────

    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}