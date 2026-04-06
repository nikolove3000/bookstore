package com.thanh.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Category;

/**
 * Repository interface for managing Category entities.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Find a category by its name.
     * @param name
     * @return
     */
    Optional<Category> findByName(String name);

    /**
     * Check if a category with the given name exists.
     * @param name
     * @return
     */
    boolean existsByName(String name);

    /**
     * Count the number of books in a category.
     * @param categoryId
     * @return
     */
    @Query("SELECT COUNT(b) FROM Book b JOIN b.categories c WHERE c.id = :categoryId")
    Long countBooksByCategoryId(Long categoryId);

}
