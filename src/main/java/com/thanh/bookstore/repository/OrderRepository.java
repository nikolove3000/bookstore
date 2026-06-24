package com.thanh.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Order;

/**
 * Repository for Order entity.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /** Returns paginated order history for a user, most recent first. */
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}