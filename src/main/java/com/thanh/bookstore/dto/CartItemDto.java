package com.thanh.bookstore.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for a single item inside the cart.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CartItemDto {

    /** Unique identifier of the cart item. */
    private Long id;

    /** ID of the book in this cart item. */
    private Long bookId;

    /** Title of the book. */
    private String title;

    /** Author name of the book. */
    private String authorName;

    /** Cover image URL of the book. */
    private String coverUrl;

    /** Unit price of the book at time of viewing. */
    private BigDecimal price;

    /** Quantity selected. */
    private Integer quantity;

    /** Subtotal — price * quantity. */
    private BigDecimal subtotal;

    /** Whether the book still has enough stock for the selected quantity. */
    private boolean inStock;
}