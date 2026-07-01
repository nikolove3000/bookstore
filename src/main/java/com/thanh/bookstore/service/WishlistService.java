package com.thanh.bookstore.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.WishlistItemDto;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.Wishlist;
import com.thanh.bookstore.exception.ResourceNotFoundException;
import com.thanh.bookstore.repository.BookRepository;
import com.thanh.bookstore.repository.WishlistRepository;

/**
 * Service for wishlist management operations.
 */
@Service
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                            BookRepository bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * Returns paginated wishlist for a user.
     */
    @Transactional(readOnly = true)
    public Page<WishlistItemDto> getWishlist(User user, Pageable pageable) {
        return wishlistRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::toDto);
    }

    /**
     * Adds a book to the user's wishlist.
     * If already present, returns the existing entry silently (idempotent).
     *
     * @throws ResourceNotFoundException if the book doesn't exist
     */
    public WishlistItemDto addToWishlist(User user, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));

        return wishlistRepository.findByUserIdAndBookId(user.getId(), bookId)
                .map(this::toDto)
                .orElseGet(() -> {
                    Wishlist entry = new Wishlist();
                    entry.setUser(user);
                    entry.setBook(book);
                    entry.setCreatedAt(LocalDateTime.now());
                    return toDto(wishlistRepository.save(entry));
                });
    }

    /**
     * Removes a book from the user's wishlist.
     *
     * @throws ResourceNotFoundException if the entry doesn't exist
     */
    public void removeFromWishlist(User user, Long bookId) {
        Wishlist entry = wishlistRepository.findByUserIdAndBookId(user.getId(), bookId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Book " + bookId + " is not in your wishlist"));
        wishlistRepository.delete(entry);
    }

    /**
     * Checks whether a book is in the user's wishlist.
     */
    @Transactional(readOnly = true)
    public boolean isInWishlist(User user, Long bookId) {
        return wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId);
    }

    // ── private ──────────────────────────────────────────

    private WishlistItemDto toDto(Wishlist entry) {
        Book book = entry.getBook();
        String category = book.getCategories().stream()
                .findFirst()
                .map(c -> c.getName())
                .orElse(null);

        WishlistItemDto dto = new WishlistItemDto();
        dto.setId(entry.getId());
        dto.setBookId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthorName(book.getAuthor() != null ? book.getAuthor().getName() : null);
        dto.setCoverUrl(book.getCoverUrl());
        dto.setPrice(book.getPrice());
        dto.setCategory(category);
        dto.setInStock(book.getStockQuantity() != null && book.getStockQuantity() > 0);
        dto.setAddedAt(entry.getCreatedAt());
        return dto;
    }
}