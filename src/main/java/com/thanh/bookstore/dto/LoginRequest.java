package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request object used to authenticate a user.
 * <p>
 * Contains the credentials required to perform login.
 * </p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LoginRequest {

    /** Username or email of the user attempting to log in. */
    private String usernameOrEmail;

    /** Password of the user. */
    private String password;
}