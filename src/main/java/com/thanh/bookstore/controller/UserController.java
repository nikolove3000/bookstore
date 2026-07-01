package com.thanh.bookstore.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.ChangePasswordRequest;
import com.thanh.bookstore.dto.ProfileDto;
import com.thanh.bookstore.dto.UpdateProfileRequest;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.service.UserService;

import jakarta.validation.Valid;

/**
 * REST controller for user profile operations.
 *
 * <p>All endpoints require authentication.</p>
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/users/me
     * Returns the current user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getProfile() {
        return ResponseEntity.ok(userService.getProfile(currentUser()));
    }

    /**
     * PUT /api/users/me
     * Updates the current user's profile fields.
     */
    @PutMapping("/me")
    public ResponseEntity<ProfileDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(currentUser(), request));
    }

    /**
     * PUT /api/users/me/password
     * Changes the current user's password.
     */
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentUser(), request);
        return ResponseEntity.noContent().build();
    }

    // ── private ──────────────────────────────────────────

    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}