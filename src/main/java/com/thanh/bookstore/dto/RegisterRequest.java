package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request object used to register a new user.
 * <p>
 * Contains the necessary information for creating a user account.
 * </p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterRequest {

    /** Username chosen by the user. */
    private String username;

    /** Email address of the user. */
    private String email;

    /** Password for the user account. */
    private String password;

    /** Full name of the user. */
    private String fullName;

    /** Phone number of the user. */
    private String phone;

    /** Address of the user. */
    private String address;
}