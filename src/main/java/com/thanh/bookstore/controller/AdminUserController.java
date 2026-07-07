package com.thanh.bookstore.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.AdminUserDto;
import com.thanh.bookstore.dto.UpdateUserRoleRequest;
import com.thanh.bookstore.service.AdminUserService;

import jakarta.validation.Valid;

/**
 * REST controller for admin user management.
 *
 * <p>All endpoints require ROLE_ADMIN — enforced by SecurityConfig.</p>
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    /**
     * GET /api/admin/users?page=0&size=20
     * Returns paginated list of all users.
     */
    @GetMapping
    public ResponseEntity<Page<AdminUserDto>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminUserService.getAllUsers(pageable));
    }

    /**
     * PATCH /api/admin/users/{id}/role
     * Updates a user's role.
     */
    @PatchMapping("/{id}/role")
    public ResponseEntity<AdminUserDto> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(adminUserService.updateRole(id, request.getRole()));
    }
}