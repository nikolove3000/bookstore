package com.thanh.bookstore.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Wishlist;

/**
 * Repository for Wishlist entity.
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    /** Returns paginated wishlist entries for a user, most recent first. */
    Page<Wishlist> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /** Finds a specific wishlist entry by user and book. */
    Optional<Wishlist> findByUserIdAndBookId(Long userId, Long bookId);

    /** Checks whether a book is in a user's wishlist. */
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
}