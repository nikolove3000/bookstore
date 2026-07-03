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
 * DTO for order data in the admin dashboard.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AdminOrderDto {

    /** Unique identifier of the order. */
    private Long id;

    /** Username of the customer. */
    private String username;

    /** Email of the customer. */
    private String email;

    /** Items in the order. */
    private List<OrderItemDto> items;

    /** Total amount of the order. */
    private BigDecimal totalAmount;

    /** Delivery address. */
    private String shippingAddress;

    /** Current status. */
    private OrderStatus status;

    /** Whether the order has been paid. */
    private boolean paid;

    /** Timestamp the order was placed. */
    private LocalDateTime createdAt;

    /** Number of distinct items. */
    private int itemCount;
}