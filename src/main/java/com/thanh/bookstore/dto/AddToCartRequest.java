package com.thanh.bookstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for adding a book to the cart.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AddToCartRequest {

    /** ID of the book to add. */
    @NotNull
    private Long bookId;

    /** Quantity to add — must be at least 1. */
    @NotNull
    @Min(1)
    private Integer quantity;
}