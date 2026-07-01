package com.thanh.bookstore.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for displaying user profile information.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProfileDto {

    /** Unique identifier of the user. */
    private Long id;

    /** Username (read-only, cannot be changed). */
    private String username;

    /** Email address. */
    private String email;

    /** Full name of the user. */
    private String fullName;

    /** Delivery address. */
    private String address;

    /** Contact phone number. */
    private String phone;

    /** Timestamp when the account was created. */
    private LocalDateTime createdAt;

    /** Role in the system. */
    private String role;
}