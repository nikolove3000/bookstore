package com.thanh.bookstore.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for a single review including its identifier.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReviewDto {

    /** Unique identifier of the review. */
    private Long id;

    /** ID of the book being reviewed. */
    private Long bookId;

    /** Reviewer's display name. */
    private String reviewerName;

    /** Rating given (1–5). */
    private Integer rating;

    /** Review text content. */
    private String comment;

    /** Timestamp when the review was posted. */
    private LocalDateTime createdAt;
}