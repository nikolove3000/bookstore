package com.thanh.bookstore.dto;

import com.thanh.bookstore.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Response object returned after a successful login.
 * <p>
 * Contains the username/email, JWT token, and the role of the authenticated user.
 * </p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class LoginResponse {

    /** Username or email of the authenticated user. */
    private String usernameOrEmail;

    /** JWT token issued for the authenticated session. */
    private String token;

    /** Role of the authenticated user. */
    private Role role;
}