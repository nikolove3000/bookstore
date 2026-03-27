package com.thanh.bookstore.entity;

import com.thanh.bookstore.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/** Represents a user in the bookstore system. */
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {

    /** Unique identifier of the user. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Username for login. */
    @Column(name = "username")
    private String username;

    /** Email address of the user. */
    @Column(name = "email")
    private String email;

    /** Hashed password of the user. */
    @Column(name = "password_hash")
    private String passwordHash;

    /** Full name of the user. */
    @Column(name = "full_name")
    private String fullName;

    /** Address of the user. */
    @Column(name = "address")
    private String address;

    /** Phone number of the user. */
    @Column(name = "phone")
    private String phone;

    /** Timestamp when the user account was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Role of the user in the system. */
    @Enumerated(EnumType.STRING)
    private Role role;

    /** Orders placed by the user. */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    /** Cart associated with the user. */
    @OneToOne(mappedBy = "user")
    private Cart cart;

    /** Reviews written by the user. */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
}