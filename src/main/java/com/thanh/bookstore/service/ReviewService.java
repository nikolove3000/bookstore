package com.thanh.bookstore.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.CreateReviewRequest;
import com.thanh.bookstore.dto.ReviewDto;
import com.thanh.bookstore.dto.ReviewEligibilityDto;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Review;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.exception.DuplicateReviewException;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.exception.ReviewNotEligibleException;
import com.thanh.bookstore.repository.BookRepository;
import com.thanh.bookstore.repository.ReviewRepository;

/**
 * Service for creating, updating, and deleting book reviews.
 */
@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public ReviewService(ReviewRepository reviewRepository, BookRepository bookRepository) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Checks whether the current user can review a book, and returns
     * their existing review if they've already posted one.
     *
     * @throws ResourceNotFoundException if the book doesn't exist
     */
    @Transactional(readOnly = true)
    public ReviewEligibilityDto checkEligibility(User user, Long bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book not found: " + bookId);
        }

        Review existing = reviewRepository.findByUserIdAndBookId(user.getId(), bookId).orElse(null);

        if (existing != null) {
            return new ReviewEligibilityDto(false, true, toDto(existing));
        }

        boolean canReview = reviewRepository.hasPurchased(user.getId(), bookId);
        return new ReviewEligibilityDto(canReview, false, null);
    }

    /**
     * Creates a review for a book.
     *
     * @throws ResourceNotFoundException    if the book doesn't exist
     * @throws ReviewNotEligibleException   if the user has not purchased the book
     * @throws DuplicateReviewException     if the user already reviewed this book
     */
    public ReviewDto createReview(User user, Long bookId, CreateReviewRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));

        if (!reviewRepository.hasPurchased(user.getId(), bookId)) {
            throw new ReviewNotEligibleException("You can only review books you have purchased");
        }

        if (reviewRepository.findByUserIdAndBookId(user.getId(), bookId).isPresent()) {
            throw new DuplicateReviewException("You have already reviewed this book — edit your existing review instead");
        }

        Review review = new Review();
        review.setUser(user);
        review.setBook(book);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return toDto(saved);
    }

    /**
     * Updates the current user's existing review.
     *
     * @throws ResourceNotFoundException if the review doesn't exist or
     *                                    doesn't belong to the given user
     */
    public ReviewDto updateReview(User user, Long reviewId, CreateReviewRequest request) {
        Review review = getOwnedReview(user, reviewId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);
        return toDto(saved);
    }

    /**
     * Deletes the current user's review.
     *
     * @throws ResourceNotFoundException if the review doesn't exist or
     *                                    doesn't belong to the given user
     */
    public void deleteReview(User user, Long reviewId) {
        Review review = getOwnedReview(user, reviewId);
        reviewRepository.delete(review);
    }

    // ── private ──────────────────────────────────────────

    /** Finds a review by ID and verifies it belongs to the given user. */
    private Review getOwnedReview(User user, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Review not found: " + reviewId);
        }
        return review;
    }

    private ReviewDto toDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setBookId(review.getBook().getId());
        dto.setReviewerName(review.getUser().getUsername());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}