package com.thanh.bookstore.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.BookDetailDto;
import com.thanh.bookstore.dto.BookRequest;
import com.thanh.bookstore.service.AdminBookService;

import jakarta.validation.Valid;

/**
 * REST controller for admin book management.
 *
 * <p>All endpoints require ROLE_ADMIN — enforced by SecurityConfig.</p>
 */
@RestController
@RequestMapping("/api/admin/books")
public class AdminBookController {

    private final AdminBookService adminBookService;

    public AdminBookController(AdminBookService adminBookService) {
        this.adminBookService = adminBookService;
    }

    /**
     * POST /api/admin/books
     * Creates a new book.
     */
    @PostMapping
    public ResponseEntity<BookDetailDto> createBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(adminBookService.createBook(request));
    }

    /**
     * PUT /api/admin/books/{id}
     * Updates an existing book.
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookDetailDto> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(adminBookService.updateBook(id, request));
    }

    /**
     * DELETE /api/admin/books/{id}
     * Deletes a book.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        adminBookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}