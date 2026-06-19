package com.thanh.bookstore.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for displaying a single review in book detail page.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryDto {

    /** Reviewer's display name. */
    private String reviewerName;

    /** Rating given (1–5). */
    private Integer rating;

    /** Review text content. */
    private String comment;

    /** Timestamp when the review was posted. */
    private LocalDateTime createdAt;
}