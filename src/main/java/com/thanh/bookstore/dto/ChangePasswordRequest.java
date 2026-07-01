package com.thanh.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for changing the user's password.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChangePasswordRequest {

    /** Current password for verification. */
    @NotBlank
    private String currentPassword;

    /** New password to set. */
    @NotBlank
    @Size(min = 8, max = 100)
    private String newPassword;
}