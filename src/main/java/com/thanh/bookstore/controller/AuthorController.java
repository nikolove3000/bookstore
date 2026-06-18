package com.thanh.bookstore.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.AuthorDto;
import com.thanh.bookstore.service.AuthorService;

/** Controller for managing author-related endpoints. */
@RestController
@RequestMapping("/api/authors")
public class AuthorController {
    
    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    /**
     * Retrieves a list of all authors along with the count of books they have written.
     * @return
     */
    @GetMapping
    public ResponseEntity<List<AuthorDto>> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    /**
     * Retrieves details of a specific author by their ID, including the count of books they have written.
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getAuthorById(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getAuthorById(id));
    }

}
