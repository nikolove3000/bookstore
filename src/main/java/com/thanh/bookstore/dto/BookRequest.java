package com.thanh.bookstore.dto;

import java.math.BigDecimal;
import java.util.Set;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for creating or updating a book (admin only).
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookRequest {

    /** Title of the book. */
    @NotBlank
    private String title;

    /** ISBN code — must be unique. */
    @NotBlank
    private String isbn;

    /** Selling price. */
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    /** Number of copies in stock. */
    @NotNull
    @Min(0)
    private Integer stockQuantity;

    /** URL of the cover image. */
    private String coverUrl;

    /** Year originally published. */
    private Integer publicationYear;

    /** Full description. */
    @Size(max = 5000)
    private String description;

    /** ID of the author. */
    @NotNull
    private Long authorId;

    /** ID of the publisher. */
    private Long publisherId;

    /** IDs of categories this book belongs to. */
    private Set<Long> categoryIds;
}