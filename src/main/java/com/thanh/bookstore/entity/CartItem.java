package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Item inside a shopping cart in the bookstore system.
 */
@Entity
@Table(name = "cart_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartItem {

    /** Unique identifier of the cart item. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Cart that contains this item. */
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    /** Book associated with this cart item. */
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    /** Quantity of the selected book in the cart. */
    @Column(name = "quantity")
    private Integer quantity;
}