package com.thanh.bookstore.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Book;

/**
 * Repository for Book entity.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {

    /**
     * Searches books by keyword across title, author name, and description.
     *
     * @param keyword  the search keyword
     * @param pageable pagination and sorting parameters
     */
    @Query("""
        SELECT DISTINCT b FROM Book b
        JOIN b.author a
        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(a.name)  LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    Page<Book> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Returns all books belonging to a specific category.
     *
     * @param categoryId the category ID
     * @param pageable   pagination parameters
     */
    @Query("""
        SELECT b FROM Book b
        JOIN b.categories c
        WHERE c.id = :categoryId
        """)
    Page<Book> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Returns all books written by a specific author.
     *
     * @param authorId the author ID
     * @param pageable pagination parameters
     */
    Page<Book> findByAuthorId(Long authorId, Pageable pageable);

    /**
     * Returns the most recently added books.
     *
     * @param pageable pagination parameters — caller controls size
     */
    @Query("SELECT b FROM Book b ORDER BY b.createdAt DESC")
    Page<Book> findNewArrivals(Pageable pageable);

    /**
     * Returns featured books — highest average rating, at least 1 review.
     *
     * @param pageable pagination parameters
     */
    @Query("""
        SELECT b FROM Book b
        WHERE SIZE(b.reviews) > 0
        ORDER BY (
            SELECT AVG(r.rating) FROM Review r WHERE r.book = b
        ) DESC
        """)
    Page<Book> findFeatured(Pageable pageable);

    /**
     * Returns books sharing any of the given categories, excluding one book.
     * Used to surface "related books" on the book detail page.
     *
     * @param categoryIds category IDs to match against
     * @param excludeId   book ID to exclude from results (the book being viewed)
     * @param pageable    limits the number of results returned
     */
    @Query("""
        SELECT DISTINCT b FROM Book b
        JOIN b.categories c
        WHERE c.id IN :categoryIds AND b.id <> :excludeId
        ORDER BY b.createdAt DESC
        """)
    List<Book> findRelatedBooks(@Param("categoryIds") Set<Long> categoryIds,
                                 @Param("excludeId") Long excludeId,
                                 Pageable pageable);

    /**
     * Returns the average rating of a book.
     *
     * @param bookId the book ID
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double findAverageRating(@Param("bookId") Long bookId);

    /**
     * Returns the total number of reviews for a book.
     *
     * @param bookId the book ID
     */
    @Query("SELECT COUNT(r) FROM Review r WHERE r.book.id = :bookId")
    Long countReviews(@Param("bookId") Long bookId);

    /**
     * Checks whether a book with the given ISBN already exists.
     *
     * @param isbn the ISBN to check
     */
    boolean existsByIsbn(String isbn);
}