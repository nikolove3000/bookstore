package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item within a customer order. */
@Entity
@Table(name = "order_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderItem {

    /** Unique identifier of the order item. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Order that contains this item. */
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    /** Book included in this order item. */
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    /** Quantity of the book ordered. */
    @Column(name = "quantity")
    private Integer quantity;

    /** Unit price of the book at the time of purchase. */
    @Column(name = "unit_price")
    private Double unitPrice;
}