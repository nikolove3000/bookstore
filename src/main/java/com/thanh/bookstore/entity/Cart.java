package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing a shopping cart in the bookstore system.
 */
@Entity
@Table(name = "carts")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cart {

    /** Unique identifier of the cart. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** User who owns this cart. */
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** Timestamp when the cart was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Items contained in this cart. */
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;
}