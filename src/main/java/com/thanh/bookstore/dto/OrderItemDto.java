package com.thanh.bookstore.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for a single item within an order.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrderItemDto {

    /** ID of the book ordered. */
    private Long bookId;

    /** Title of the book at time of order. */
    private String title;

    /** Cover image URL of the book. */
    private String coverUrl;

    /** Quantity ordered. */
    private Integer quantity;

    /** Unit price at time of purchase. */
    private BigDecimal unitPrice;

    /** Subtotal — unitPrice * quantity. */
    private BigDecimal subtotal;
}