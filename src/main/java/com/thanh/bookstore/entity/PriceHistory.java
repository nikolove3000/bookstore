package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/** Historical record of a book's price change. */
@Entity
@Table(name = "price_history")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PriceHistory {

    /** Unique identifier of the price history record. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Previous price of the book. */
    @Column(name = "old_price")
    private Double oldPrice;

    /** New price of the book. */
    @Column(name = "new_price")
    private Double newPrice;

    /** Timestamp when the price was changed. */
    @Column(name = "changed_at")
    private LocalDateTime changedAt;

    /** Book associated with this price change. */
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
}