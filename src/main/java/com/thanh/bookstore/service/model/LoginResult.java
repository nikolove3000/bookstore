package com.thanh.bookstore.service.model;

import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Result object returned after successful authentication.
 *
 * <p>Contains both API response data and the authenticated user
 * entity for further service operations.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginResult {

    private LoginResponse loginResponse;
    private User user;
}
