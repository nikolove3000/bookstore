package com.thanh.bookstore.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for the full shopping cart.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CartDto {

    /** Unique identifier of the cart. */
    private Long id;

    /** Items currently in the cart. */
    private List<CartItemDto> items;

    /** Total number of items (sum of quantities). */
    private Integer totalItems;

    /** Total price of all items combined. */
    private BigDecimal totalPrice;
}