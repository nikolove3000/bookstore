package com.thanh.bookstore.repository;

import com.thanh.bookstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/** Repository for managing {@link User} entities. */
public interface UserRepository extends JpaRepository<User, Long> {

    /** Finds a user by their username. */
    Optional<User> findByUsername(String username);

    /** Finds a user by their email. */
    Optional<User> findByEmail(String email);

    /** Checks if a user exists with the given username. */
    boolean existsByUsername(String username);

    /** Checks if a user exists with the given email. */
    boolean existsByEmail(String email);
}