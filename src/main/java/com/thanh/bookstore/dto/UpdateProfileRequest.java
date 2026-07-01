package com.thanh.bookstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for updating user profile information.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateProfileRequest {

    /** Updated full name. */
    @Size(max = 100)
    private String fullName;

    /** Updated email address. */
    @Email
    private String email;

    /** Updated delivery address. */
    @Size(max = 255)
    private String address;

    /** Updated contact phone number. */
    @Size(max = 20)
    private String phone;
}