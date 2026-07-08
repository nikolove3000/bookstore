package com.thanh.bookstore.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.AuthorDto;
import com.thanh.bookstore.dto.CreateAuthorRequest;
import com.thanh.bookstore.entity.Author;
import com.thanh.bookstore.repository.AuthorRepository;

/**
 * Service class for managing author-related operations.
 */
@Service
@Transactional(readOnly = true)
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    /**
     * Retrieves all authors
     */
    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Retrieves an author by their ID
     */
    public AuthorDto getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        return toDto(author);
    }

    /**
     * Converts an Author entity to an AuthorDto, including the count of books
     * written by the author.
     *
     * @param author
     * @return
     */
    private AuthorDto toDto(Author author) {
        Long bookCount = authorRepository.countBooksByAuthorId(author.getId());
        return new AuthorDto(
                author.getId(),
                author.getName(),
                author.getBio(),
                bookCount);
    }

    @Transactional
    public AuthorDto createAuthor(CreateAuthorRequest request) {
        Author author = new Author();
        author.setName(request.getName());
        author.setBio(request.getBio());
        Author saved = authorRepository.save(author);
        return toDto(saved);
    }

}
