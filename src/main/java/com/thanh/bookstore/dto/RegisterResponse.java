package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Response object returned after a successful user registration.
 * <p>
 * Contains basic information of the newly registered user.
 * </p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RegisterResponse {

    /** Username of the registered user. */
    private String username;

    /** Email address of the registered user. */
    private String email;
}