package com.thanh.bookstore.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for creating or updating a review.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateReviewRequest {

    /** Rating from 1 to 5. */
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    /** Review text content. */
    @Size(max = 2000)
    private String comment;
}