package com.thanh.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Cart;

/**
 * Repository for Cart entity.
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /** Finds the cart belonging to a specific user. */
    Optional<Cart> findByUserId(Long userId);
}