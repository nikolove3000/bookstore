package com.thanh.bookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.thanh.bookstore.entity.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for order history list view.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrderSummaryDto {

    /** Unique identifier of the order. */
    private Long id;

    /** Total amount of the order. */
    private BigDecimal totalAmount;

    /** Current processing status. */
    private OrderStatus status;

    /** Whether the order has been paid. */
    private boolean paid;

    /** Timestamp the order was placed. */
    private LocalDateTime createdAt;

    /** Number of distinct items in the order. */
    private int itemCount;

    /** Cover image of the first item — used as a thumbnail. */
    private String previewCoverUrl;
}