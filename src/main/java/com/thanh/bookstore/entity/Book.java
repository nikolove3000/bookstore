package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Entity representing a book in the bookstore system.
 */
@Entity
@Table(name = "books")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Book {

    /** Unique identifier of the book. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Title of the book. */
    @Column(name = "title")
    private String title;

    /** ISBN code used to identify the book edition. */
    @Column(name = "isbn")
    private String isbn;

    /** Selling price of the book. */
    @Column(name = "price")
    private Double price;

    /** Number of books available in stock. */
    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    /** URL of the book's cover image. */
    @Column(name = "cover_url")
    private String coverUrl;

    /** Year when the book was published. */
    @Column(name = "publication_year")
    private Integer publicationYear;

    /** Author of the book. */
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    /** Publisher of the book. */
    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    /** Description or summary of the book. */
    @Column(name = "description")
    private String description;

    /** Timestamp when the book record was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Categories associated with this book. */
    @ManyToMany
    @JoinTable(
            name = "book_categories",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    /** Price history records of this book. */
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PriceHistory> priceHistories = new ArrayList<>();

    /** Order items containing this book. */
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    /** Cart items containing this book. */
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;

    /** Reviews written for this book. */
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
}