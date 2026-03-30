package com.thanh.bookstore.controller;

import com.thanh.bookstore.dto.LoginRequest;
import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.dto.RegisterRequest;
import com.thanh.bookstore.dto.RegisterResponse;
import com.thanh.bookstore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication operations.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /**
     * Creates an AuthController.
     *
     * @param userService service handling authentication logic
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registers a new user account.
     *
     * @param request registration data
     * @return registered user information
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.created(null).body(userService.register(request));
    }

    /**
     * Authenticates a user.
     *
     * @param request login credentials
     * @return authentication result containing access token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(userService.login(request));
    }
}