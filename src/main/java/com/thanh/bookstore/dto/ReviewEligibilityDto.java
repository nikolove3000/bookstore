package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Tells the client whether the current user can review a book,
 * and returns their existing review if one was already posted.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEligibilityDto {

    /** True if the user has purchased the book and hasn't reviewed it yet. */
    private boolean canReview;

    /** True if the user has already reviewed this book. */
    private boolean hasReviewed;

    /** The user's existing review, if any. Null when hasReviewed is false. */
    private ReviewDto myReview;
}