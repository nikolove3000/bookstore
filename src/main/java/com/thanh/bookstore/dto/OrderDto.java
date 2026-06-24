package com.thanh.bookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.thanh.bookstore.entity.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for full order detail.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrderDto {

    /** Unique identifier of the order. */
    private Long id;

    /** Items included in this order. */
    private List<OrderItemDto> items;

    /** Total amount of the order. */
    private BigDecimal totalAmount;

    /** Delivery address. */
    private String shippingAddress;

    /** Current processing status. */
    private OrderStatus status;

    /** Whether the order has been paid. */
    private boolean paid;

    /** Timestamp the order was placed. */
    private LocalDateTime createdAt;
}