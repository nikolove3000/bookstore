package com.thanh.bookstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "Username can not be blank!")
    @Size(min = 3, max = 50, message = "Your username must be in 3-50 characters!")
    private String username;

    /** Email address of the user. */
    @NotBlank(message = "Email can not be blank!")
    @Email(message = "Please enter a valid email!")
    private String email;

    /** Password for the user account. */
    @NotBlank(message = "Password can not be blank!")
    @Size(min = 6, message = "Password must have more than 6 characters!")
    private String password;

    /** Full name of the user. */
    @NotBlank(message = "Full name can not be blank!")
    private String fullName;

    /** Phone number of the user. */
    private String phone;

    /** Address of the user. */
    private String address;
}