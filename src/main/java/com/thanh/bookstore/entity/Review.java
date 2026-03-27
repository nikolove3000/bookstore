package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/** Represents a review of a book by a user. */
@Entity
@Table(name = "reviews")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Review {

    /** Unique identifier of the review. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** User who created the review. */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** Book being reviewed. */
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    /** Rating given by the user (e.g., 1–5). */
    @Column(name = "rating")
    private Integer rating;

    /** Text comment provided by the user. */
    @Column(name = "comment")
    private String comment;

    /** Timestamp when the review was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}