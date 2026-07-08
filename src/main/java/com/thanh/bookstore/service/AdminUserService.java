package com.thanh.bookstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.AdminUserDto;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.enums.Role;
import com.thanh.bookstore.exception.InvalidRoleChangeException;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.UserRepository;

/**
 * Service for admin user management operations.
 */
@Service
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns paginated list of all users.
     */
    @Transactional(readOnly = true)
    public Page<AdminUserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDto);
    }

    /**
     * Updates a user's role.
     *
     * @throws ResourceNotFoundException if the user doesn't exist
     * @throws InvalidRoleChangeException if the caller targets themself, or
     * would demote the last remaining admin
     */
    public AdminUserDto updateRole(Long userId, Role newRole, User currentUser) {
        if (userId.equals(currentUser.getId())) {
            throw new InvalidRoleChangeException("You cannot change your own role");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getRole() == Role.ADMIN
                && newRole != Role.ADMIN
                && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new InvalidRoleChangeException("Cannot demote the last remaining admin");
        }

        user.setRole(newRole);
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    // ── private ──────────────────────────────────────────
    private AdminUserDto toDto(User user) {
        AdminUserDto dto = new AdminUserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setOrderCount(user.getOrders() != null ? user.getOrders().size() : 0);
        return dto;
    }
}
