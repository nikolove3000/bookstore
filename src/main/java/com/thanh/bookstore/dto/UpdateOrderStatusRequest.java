package com.thanh.bookstore.dto;

import com.thanh.bookstore.entity.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for advancing an order's status (admin only).
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateOrderStatusRequest {

    /** New status to apply. */
    @NotNull
    private OrderStatus status;
}