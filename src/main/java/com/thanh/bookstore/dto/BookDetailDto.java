package com.thanh.bookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for transferring full book data in detail view.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookDetailDto {

    /** Unique identifier of the book. */
    private Long id;

    /** Title of the book. */
    private String title;

    /** ISBN code of the book. */
    private String isbn;

    /** Selling price of the book. */
    private BigDecimal price;

    /** Number of copies currently in stock. */
    private Integer stockQuantity;

    /** URL of the book cover image. */
    private String coverUrl;

    /** Year the book was originally published. */
    private Integer publicationYear;

    /** Full description of the book. */
    private String description;

    /** Timestamp when the book was added to the catalog. */
    private LocalDateTime createdAt;

    /** Author details. */
    private AuthorDto author;

    /** Publisher details. */
    private PublisherDto publisher;

    /** List of categories this book belongs to. */
    private List<CategoryDto> categories;

    /** Average rating from all reviews. */
    private Double averageRating;

    /** Total number of reviews. */
    private Long reviewCount;
}