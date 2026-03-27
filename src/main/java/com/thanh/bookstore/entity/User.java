package com.thanh.bookstore.entity;

import com.thanh.bookstore.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Entity representing a user in the bookstore system.
 *
 * <p>
 * This class is a JPA entity mapped to the {@code users} table
 * and implements {@link UserDetails} to integrate with Spring Security.
 * It stores login credentials, personal information, role, and
 * related orders, cart, and reviews.
 * </p>
 *
 * <p><b>Relationships:</b>
 * <ul>
 *     <li>One user → many orders (One-to-Many)</li>
 *     <li>One user → one cart (One-to-One)</li>
 *     <li>One user → many reviews (One-to-Many)</li>
 * </ul>
 * </p>
 */
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User implements UserDetails {

    /**
     * Unique identifier of the user.
     *
     * <p>Automatically generated using identity strategy.</p>
     */
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

    /** Hashed password used for authentication. */
    @Column(name = "password_hash")
    private String passwordHash;

    /** Full name of the user. */
    @Column(name = "full_name")
    private String fullName;

    /** Address of the user. */
    @Column(name = "address")
    private String address;

    /** Contact phone number of the user. */
    @Column(name = "phone")
    private String phone;

    /** Timestamp when the user account was created. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** Role of the user in the system. */
    @Enumerated(EnumType.STRING)
    private Role role;

    /**
     * Orders placed by the user.
     *
     * <p>
     * Relationship mapping:
     * <ul>
     *     <li>One user → many orders</li>
     *     <li>{@code mappedBy = "user"} indicates owning side is in {@link Order}</li>
     *     <li>{@code CascadeType.ALL} propagates persistence operations</li>
     *     <li>{@code orphanRemoval = true} deletes orders detached from this user</li>
     * </ul>
     * </p>
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    /**
     * Shopping cart associated with the user.
     *
     * <p>
     * Relationship mapping:
     * <ul>
     *     <li>One user → one cart</li>
     *     <li>{@code mappedBy = "user"} indicates the owning side is in {@link Cart}</li>
     * </ul>
     * </p>
     */
    @OneToOne(mappedBy = "user")
    private Cart cart;

    /**
     * Reviews written by the user.
     *
     * <p>
     * Relationship mapping:
     * <ul>
     *     <li>One user → many reviews</li>
     *     <li>{@code mappedBy = "user"} indicates owning side is in {@link Review}</li>
     *     <li>{@code CascadeType.ALL} propagates persistence operations</li>
     *     <li>{@code orphanRemoval = true} deletes reviews detached from this user</li>
     * </ul>
     * </p>
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    /**
     * Returns authorities granted to the user.
     *
     * <p>
     * Converts the {@link Role} enum to a {@link SimpleGrantedAuthority}.
     * </p>
     *
     * @return collection of authorities for Spring Security
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * Returns the hashed password for authentication.
     *
     * @return password hash
     */
    @Override
    public String getPassword() {
        return passwordHash;
    }

    /** Account is always non-expired for simplicity. */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /** Account is always non-locked for simplicity. */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /** Credentials are always non-expired for simplicity. */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /** Account is always enabled for simplicity. */
    @Override
    public boolean isEnabled() {
        return true;
    }
}