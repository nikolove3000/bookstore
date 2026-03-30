package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Represents a refresh token associated with a user for JWT authentication.
 */
@Entity
@Table(name = "refresh_token")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RefreshToken {

    /** Unique identifier of the refresh token. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** User associated with this refresh token. */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** User unique token.string */
    @Column(name = "token", unique = true)
    private String token;

    /** Timestamp when the token was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Timestamp when the token expires. */
    @Column(name = "expired_at")
    private LocalDateTime expiredAt;
}