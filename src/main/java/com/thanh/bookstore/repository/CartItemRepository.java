package com.thanh.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.CartItem;

/**
 * Repository for CartItem entity.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /** Finds a cart item by cart ID and book ID — used to check for duplicates. */
    Optional<CartItem> findByCartIdAndBookId(Long cartId, Long bookId);
}