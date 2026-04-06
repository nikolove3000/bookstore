package com.thanh.bookstore.repository;

import org.springframework.stereotype.Repository;
import com.thanh.bookstore.entity.Author;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Repository for managing Author entities.
 */
@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    /**
     * Find an author by their name.
     * @param name
     * @return
     */
    Optional<Author> findByName(String name);

    /**
     * Check if an author with the given name already exists.
     * @param name
     * @return
     */
    boolean existsByName(String name);

    /**
     * Count the number of books written by a specific author.
     * @param authorId
     * @return
     */
    @Query("SELECT COUNT(b) FROM Book b WHERE b.author.id = :authorId")
    Long countBooksByAuthorId(Long authorId);
    
}
