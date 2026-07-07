package com.thanh.bookstore.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.AuthorDto;
import com.thanh.bookstore.dto.BookDetailDto;
import com.thanh.bookstore.dto.BookSummaryDto;
import com.thanh.bookstore.dto.CategoryDto;
import com.thanh.bookstore.dto.PublisherDto;
import com.thanh.bookstore.dto.ReviewSummaryDto;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Category;
import com.thanh.bookstore.entity.Review;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.BookRepository;
import com.thanh.bookstore.repository.ReviewRepository;
import com.thanh.bookstore.specification.BookSpecification;

/**
 * Service for book retrieval and catalog operations.
 */
@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public BookService(BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    /**
     * Returns a paginated list of books, optionally filtered by keyword,
     * category, and price range. All filters are optional and combine with AND.
     *
     * @param keyword    search term matched against title, author, description
     * @param categoryId category filter
     * @param minPrice   minimum price filter
     * @param maxPrice   maximum price filter
     * @param pageable   pagination and sorting parameters
     */
    public Page<BookSummaryDto> getAllBooks(String keyword, Long categoryId,
                                             BigDecimal minPrice, BigDecimal maxPrice,
                                             Pageable pageable) {
        Specification<Book> spec = Specification.where(BookSpecification.matchesKeyword(keyword))
                .and(BookSpecification.hasCategory(categoryId))
                .and(BookSpecification.hasMinPrice(minPrice))
                .and(BookSpecification.hasMaxPrice(maxPrice));

        return bookRepository.findAll(spec, pageable)
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
     * @param keyword  search term matched against title, author, description
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
     * @param pageable   pagination parameters
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

    /**
     * Returns books related to the given book by shared category.
     * Falls back to an empty list if the book has no categories.
     *
     * @param bookId the book to find related titles for
     * @param limit  maximum number of related books to return
     * @throws ResourceNotFoundException if book not found
     */
    public List<BookSummaryDto> getRelatedBooks(Long bookId, int limit) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));

        Set<Long> categoryIds = book.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toSet());

        if (categoryIds.isEmpty()) {
            return List.of();
        }

        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findRelatedBooks(categoryIds, bookId, pageable).stream()
                .map(this::toSummaryDto)
                .toList();
    }

    /**
     * Returns paginated reviews for a book, most recent first.
     *
     * @param bookId   the book ID
     * @param pageable pagination parameters
     */
    public Page<ReviewSummaryDto> getBookReviews(Long bookId, Pageable pageable) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId, pageable)
                .map(this::toReviewDto);
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

    private ReviewSummaryDto toReviewDto(Review review) {
        String reviewerName = review.getUser() != null ? review.getUser().getUsername() : "Anonymous";
        return new ReviewSummaryDto(
                reviewerName,
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}