package com.thanh.bookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for a single item in the wishlist.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WishlistItemDto {

    /** ID of the wishlist entry. */
    private Long id;

    /** ID of the book. */
    private Long bookId;

    /** Title of the book. */
    private String title;

    /** Author name. */
    private String authorName;

    /** Cover image URL. */
    private String coverUrl;

    /** Current price. */
    private BigDecimal price;

    /** Primary category. */
    private String category;

    /** Whether the book is currently in stock. */
    private boolean inStock;

    /** Timestamp when added to wishlist. */
    private LocalDateTime addedAt;
}