package com.thanh.bookstore.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.BookDetailDto;
import com.thanh.bookstore.dto.BookSummaryDto;
import com.thanh.bookstore.dto.ReviewSummaryDto;
import com.thanh.bookstore.service.BookService;

/**
 * REST controller for book catalog endpoints.
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * GET /api/books
     * Returns a paginated list of books, optionally filtered by keyword,
     * category, and price range. Powers the Book List page.
     */
    @GetMapping
    public ResponseEntity<Page<BookSummaryDto>> getAllBooks(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(bookService.getAllBooks(q, categoryId, minPrice, maxPrice, pageable));
    }

    /**
     * GET /api/books/{id}
     * Returns full detail of a single book.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookDetailDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    /**
     * GET /api/books/{id}/related?limit=4
     * Returns books related to this one by shared category.
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<List<BookSummaryDto>> getRelatedBooks(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(bookService.getRelatedBooks(id, limit));
    }

    /**
     * GET /api/books/{id}/reviews
     * Returns paginated reviews for this book, most recent first.
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewSummaryDto>> getBookReviews(
            @PathVariable Long id,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(bookService.getBookReviews(id, pageable));
    }

    /**
     * GET /api/books/search?q=keyword
     * Returns paginated books matching the search keyword.
     */
    @GetMapping("/search")
    public ResponseEntity<Page<BookSummaryDto>> searchBooks(
            @RequestParam String q,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.searchBooks(q, pageable));
    }

    /**
     * GET /api/books/category/{categoryId}
     * Returns paginated books belonging to a category.
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getBooksByCategory(categoryId, pageable));
    }

    /**
     * GET /api/books/author/{authorId}
     * Returns paginated books written by an author.
     */
    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByAuthor(
            @PathVariable Long authorId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getBooksByAuthor(authorId, pageable));
    }

    /**
     * GET /api/books/new-arrivals?limit=6
     * Returns the most recently added books.
     */
    @GetMapping("/new-arrivals")
    public ResponseEntity<List<BookSummaryDto>> getNewArrivals(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(bookService.getNewArrivals(limit));
    }

    /**
     * GET /api/books/featured?limit=3
     * Returns featured books ordered by average rating.
     */
    @GetMapping("/featured")
    public ResponseEntity<List<BookSummaryDto>> getFeaturedBooks(
            @RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(bookService.getFeaturedBooks(limit));
    }
}