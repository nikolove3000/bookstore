package com.thanh.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for placing an order from the current cart.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CheckoutRequest {

    /** Delivery address for this order. */
    @NotBlank
    private String shippingAddress;
}