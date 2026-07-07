package com.thanh.bookstore.service;

import com.thanh.bookstore.dto.BookDetailDto;
import com.thanh.bookstore.dto.BookRequest;
import com.thanh.bookstore.dto.AuthorDto;
import com.thanh.bookstore.dto.CategoryDto;
import com.thanh.bookstore.dto.PublisherDto;
import com.thanh.bookstore.entity.Author;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Category;
import com.thanh.bookstore.entity.Publisher;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.AuthorRepository;
import com.thanh.bookstore.repository.BookRepository;
import com.thanh.bookstore.repository.CategoryRepository;
import com.thanh.bookstore.repository.PublisherRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service for admin book management operations (create, update, delete).
 */
@Service
@Transactional
public class AdminBookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;

    public AdminBookService(BookRepository bookRepository,
                             AuthorRepository authorRepository,
                             PublisherRepository publisherRepository,
                             CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Creates a new book.
     *
     * @throws ResourceNotFoundException  if author, publisher, or any category doesn't exist
     * @throws EntityExistsException      if the ISBN is already in use
     */
    public BookDetailDto createBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new EntityExistsException("A book with ISBN " + request.getIsbn() + " already exists");
        }

        Book book = new Book();
        applyRequest(book, request);
        book.setCreatedAt(LocalDateTime.now());

        Book saved = bookRepository.save(book);
        return toDetailDto(saved);
    }

    /**
     * Updates an existing book.
     *
     * @throws ResourceNotFoundException if the book, author, publisher, or any category doesn't exist
     * @throws EntityExistsException     if the new ISBN is already used by another book
     */
    public BookDetailDto updateBook(Long bookId, BookRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));

        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new EntityExistsException("A book with ISBN " + request.getIsbn() + " already exists");
        }

        applyRequest(book, request);
        Book saved = bookRepository.save(book);
        return toDetailDto(saved);
    }

    /**
     * Deletes a book.
     *
     * @throws ResourceNotFoundException      if the book doesn't exist
     * @throws DataIntegrityViolationException if the book is referenced by existing orders
     */
    public void deleteBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));
        bookRepository.delete(book);
    }

    // ── private ──────────────────────────────────────────

    private void applyRequest(Book book, BookRequest request) {
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + request.getAuthorId()));

        Publisher publisher = null;
        if (request.getPublisherId() != null) {
            publisher = publisherRepository.findById(request.getPublisherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Publisher not found: " + request.getPublisherId()));
        }

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null) {
            for (Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
                categories.add(category);
            }
        }

        book.setTitle(request.getTitle());
        book.setIsbn(request.getIsbn());
        book.setPrice(request.getPrice());
        book.setStockQuantity(request.getStockQuantity());
        book.setCoverUrl(request.getCoverUrl());
        book.setPublicationYear(request.getPublicationYear());
        book.setDescription(request.getDescription());
        book.setAuthor(author);
        book.setPublisher(publisher);
        book.setCategories(categories);
    }

    private BookDetailDto toDetailDto(Book book) {
        List<CategoryDto> categories = book.getCategories().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), null))
                .toList();

        AuthorDto authorDto = new AuthorDto(
                book.getAuthor().getId(),
                book.getAuthor().getName(),
                book.getAuthor().getBio(),
                null);

        PublisherDto publisherDto = book.getPublisher() != null
                ? new PublisherDto(
                        book.getPublisher().getId(),
                        book.getPublisher().getName(),
                        book.getPublisher().getAddress(),
                        book.getPublisher().getPhone())
                : null;

        BookDetailDto dto = new BookDetailDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setIsbn(book.getIsbn());
        dto.setPrice(book.getPrice());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setCoverUrl(book.getCoverUrl());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setDescription(book.getDescription());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setAuthor(authorDto);
        dto.setPublisher(publisherDto);
        dto.setCategories(categories);
        dto.setAverageRating(null);
        dto.setReviewCount(0L);
        return dto;
    }
}