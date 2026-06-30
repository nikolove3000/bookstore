package com.thanh.bookstore.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Review;

/**
 * Repository for Review entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Returns paginated reviews for a book, most recent first.
     *
     * @param bookId the book ID
     * @param pageable pagination parameters
     */
    Page<Review> findByBookIdOrderByCreatedAtDesc(Long bookId, Pageable pageable);

    /**
     * Finds an existing review by a user for a specific book.
     */
    Optional<Review> findByUserIdAndBookId(Long userId, Long bookId);

    /**
     * Checks whether a user has any non-cancelled order containing the given
     * book — used to enforce verified-purchase reviews.
     */
    @Query("""
    SELECT COUNT(oi) > 0 FROM OrderItem oi
    WHERE oi.book.id = :bookId
      AND oi.order.user.id = :userId
      AND oi.order.status = 'DELIVERED'
    """)
    boolean hasPurchased(@Param("userId") Long userId, @Param("bookId") Long bookId);
}
