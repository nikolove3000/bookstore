package com.thanh.bookstore.dto;

import com.thanh.bookstore.entity.enums.Role;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for changing a user's role (admin only).
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateUserRoleRequest {

    /** New role to assign. */
    @NotNull
    private Role role;
}