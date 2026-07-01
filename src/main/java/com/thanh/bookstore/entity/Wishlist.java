package com.thanh.bookstore.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a book saved to a user's wishlist.
 */
@Entity
@Table(name = "wishlists",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "book_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Wishlist {

    /** Unique identifier of the wishlist entry. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** User who saved this book. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Book saved to the wishlist. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    /** Timestamp when the book was added to the wishlist. */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}