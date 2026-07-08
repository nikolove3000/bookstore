package com.thanh.bookstore.controller;

import com.thanh.bookstore.dto.AuthorDto;
import com.thanh.bookstore.dto.CreateAuthorRequest;
import com.thanh.bookstore.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<List<AuthorDto>> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getAuthorById(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getAuthorById(id));
    }

    /**
     * POST /api/authors — admin only. Creates a new author for use when adding
     * books.
     */
    @PostMapping
    public ResponseEntity<AuthorDto> createAuthor(@Valid @RequestBody CreateAuthorRequest request) {
        return ResponseEntity.ok(authorService.createAuthor(request));
    }
}
