package com.thanh.bookstore.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for transferring brief book data in list and grid views.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookSummaryDto {

    /** Unique identifier of the book. */
    private Long id;

    /** Title of the book. */
    private String title;

    /** Name of the book's author. */
    private String authorName;

    /** Selling price of the book. */
    private BigDecimal price;

    /** URL of the book cover image. */
    private String coverUrl;

    /** Primary category name. */
    private String category;

    /** Average rating from reviews (null if no reviews). */
    private Double averageRating;

    /** Total number of reviews. */
    private Long reviewCount;

    /** Whether the book is currently in stock. */
    private boolean inStock;
}