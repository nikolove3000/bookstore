package com.thanh.bookstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for updating a cart item's quantity.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateQuantityRequest {

    /** New quantity — must be at least 1. */
    @NotNull
    @Min(1)
    private Integer quantity;
}