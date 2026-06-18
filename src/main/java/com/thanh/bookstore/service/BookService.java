package com.thanh.bookstore.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.AuthorDto;
import com.thanh.bookstore.dto.BookDetailDto;
import com.thanh.bookstore.dto.BookSummaryDto;
import com.thanh.bookstore.dto.CategoryDto;
import com.thanh.bookstore.dto.PublisherDto;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.BookRepository;

/**
 * Service for book retrieval and catalog operations.
 */
@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * Returns a paginated list of all books.
     *
     * @param pageable pagination and sorting parameters
     */
    public Page<BookSummaryDto> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(this::toSummaryDto);
    }

    /**
     * Returns full detail of a single book by ID.
     *
     * @throws ResourceNotFoundException if book not found
     */
    public BookDetailDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));
        return toDetailDto(book);
    }

    /**
     * Returns a paginated list of books matching the search keyword.
     *
     * @param keyword search term matched against title, author, description
     * @param pageable pagination parameters
     */
    public Page<BookSummaryDto> searchBooks(String keyword, Pageable pageable) {
        return bookRepository.searchByKeyword(keyword, pageable)
                .map(this::toSummaryDto);
    }

    /**
     * Returns a paginated list of books belonging to a category.
     *
     * @param categoryId the category ID
     * @param pageable pagination parameters
     */
    public Page<BookSummaryDto> getBooksByCategory(Long categoryId, Pageable pageable) {
        return bookRepository.findByCategoryId(categoryId, pageable)
                .map(this::toSummaryDto);
    }

    /**
     * Returns a paginated list of books written by an author.
     *
     * @param authorId the author ID
     * @param pageable pagination parameters
     */
    public Page<BookSummaryDto> getBooksByAuthor(Long authorId, Pageable pageable) {
        return bookRepository.findByAuthorId(authorId, pageable)
                .map(this::toSummaryDto);
    }

    /**
     * Returns the most recently added books.
     *
     * @param limit maximum number of books to return
     */
    public List<BookSummaryDto> getNewArrivals(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return bookRepository.findNewArrivals(pageable)
                .map(this::toSummaryDto)
                .toList();
    }

    /**
     * Returns featured books ordered by average rating.
     *
     * @param limit maximum number of books to return
     */
    public List<BookSummaryDto> getFeaturedBooks(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findFeatured(pageable)
                .map(this::toSummaryDto)
                .toList();
    }

    // ── private ──────────────────────────────────────────
    private BookSummaryDto toSummaryDto(Book book) {
        Double avgRating = bookRepository.findAverageRating(book.getId());
        Long reviewCount = bookRepository.countReviews(book.getId());

        String category = book.getCategories().stream()
                .findFirst()
                .map(c -> c.getName())
                .orElse(null);

        return new BookSummaryDto(
                book.getId(),
                book.getTitle(),
                book.getAuthor() != null ? book.getAuthor().getName() : null,
                book.getPrice(),
                book.getCoverUrl(),
                category,
                avgRating,
                reviewCount,
                book.getStockQuantity() != null && book.getStockQuantity() > 0
        );
    }

    private BookDetailDto toDetailDto(Book book) {
        Double avgRating = bookRepository.findAverageRating(book.getId());
        Long reviewCount = bookRepository.countReviews(book.getId());

        List<CategoryDto> categories = book.getCategories().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), null))
                .toList();

        AuthorDto authorDto = book.getAuthor() != null
                ? new AuthorDto(
                        book.getAuthor().getId(),
                        book.getAuthor().getName(),
                        book.getAuthor().getBio(),
                        null)
                : null;

        PublisherDto publisherDto = book.getPublisher() != null
                ? new PublisherDto(
                        book.getPublisher().getId(),
                        book.getPublisher().getName(),
                        book.getPublisher().getAddress(),
                        book.getPublisher().getPhone())
                : null;

        return new BookDetailDto(
                book.getId(),
                book.getTitle(),
                book.getIsbn(),
                book.getPrice(),
                book.getStockQuantity(),
                book.getCoverUrl(),
                book.getPublicationYear(),
                book.getDescription(),
                book.getCreatedAt(),
                authorDto,
                publisherDto,
                categories,
                avgRating,
                reviewCount
        );
    }
}
