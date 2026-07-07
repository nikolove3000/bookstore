package com.thanh.bookstore.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for user data in the admin dashboard.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AdminUserDto {

    /** Unique identifier of the user. */
    private Long id;

    /** Username. */
    private String username;

    /** Email address. */
    private String email;

    /** Full name. */
    private String fullName;

    /** Current role. */
    private String role;

    /** Timestamp when the account was created. */
    private LocalDateTime createdAt;

    /** Total number of orders placed. */
    private int orderCount;
}