package com.thanh.bookstore.repository;
 
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.thanh.bookstore.entity.Review;
 
/**
 * Repository for Review entity.
 * Minimal for now — full review CRUD lives in its own feature.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
 
    /**
     * Returns paginated reviews for a book, most recent first.
     *
     * @param bookId   the book ID
     * @param pageable pagination parameters
     */
    Page<Review> findByBookIdOrderByCreatedAtDesc(Long bookId, Pageable pageable);
}