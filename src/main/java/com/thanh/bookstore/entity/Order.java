package com.thanh.bookstore.entity;

import com.thanh.bookstore.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Customer order in the bookstore system.
 */
@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Order {

    /** Unique identifier of the order. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** User who placed this order. */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** Total monetary amount of the order. */
    @Column(name = "total_amount")
    private Double totalAmount;

    /** Shipping address where the order will be delivered. */
    @Column(name = "shipping_address")
    private String shippingAddress;

    /** Current processing status of the order. */
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    /** Indicates whether the order has been paid. */
    @Column(name = "is_paid")
    private boolean isPaid;

    /** Timestamp indicating when the order was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Items included in this order. */
    @OneToMany(mappedBy = "order", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();
}