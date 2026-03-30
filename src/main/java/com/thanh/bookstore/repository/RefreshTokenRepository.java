package com.thanh.bookstore.repository;

import com.thanh.bookstore.entity.RefreshToken;
import com.thanh.bookstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for managing {@link RefreshToken} persistence operations.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /** Retrieves a refresh token by its string value. */
    Optional<RefreshToken> findByToken(String token);

    /** Deletes all refresh tokens associated with a given user. */
    void deleteByUser(User user);
}