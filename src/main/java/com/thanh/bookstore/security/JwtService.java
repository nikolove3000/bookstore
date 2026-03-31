package com.thanh.bookstore.security;

import com.thanh.bookstore.entity.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

/**
 * Service responsible for issuing and validating JSON Web Tokens (JWT)
 * used for authentication within the security layer.
 *
 * <p>Role: Security Service.</p>
 *
 * <p>Provides token generation, claim extraction, and validation
 * supporting JWT-based authentication and authorization.</p>
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private static final Logger log = LogManager.getLogger(JwtService.class);

    /**
     * Generates an access token representing the authenticated user.
     *
     * <p>The token contains the user identifier as subject and assigned roles
     * as claims, signed using the configured secret key.</p>
     *
     * @param user authenticated user entity
     * @return signed JWT access token
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("roles", List.of(user.getRole().name()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the user identifier stored as the token subject.
     *
     * @param token JWT token
     * @return user identifier contained in the token
     * @throws JwtException if the token cannot be parsed or verified
     */
    public String extractId(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Retrieves the expiration timestamp of the token.
     *
     * @param token JWT token
     * @return token expiration date
     * @throws JwtException if the token cannot be parsed or verified
     */
    public Date extractExpiration(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    /**
     * Validates token integrity and expiration status.
     *
     * <p>Returns {@code false} if the token is expired, malformed,
     * or fails signature verification.</p>
     *
     * @param token JWT token
     * @return {@code true} if token is valid and not expired; otherwise {@code false}
     */
    public boolean isTokenValid(String token) {
        try {
            Date expiration = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();

            return expiration.after(new Date());
        } catch (ExpiredJwtException e) {
            log.warn("Token expired: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.warn("Invalid token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Provides the cryptographic signing key used for JWT operations.
     *
     * @return HMAC signing key derived from configured secret
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}