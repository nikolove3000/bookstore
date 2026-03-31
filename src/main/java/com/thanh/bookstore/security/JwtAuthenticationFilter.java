package com.thanh.bookstore.security;

import com.thanh.bookstore.repository.TokenBlacklistRepository;
import com.thanh.bookstore.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter responsible for JWT-based authentication.
 *
 * <p>
 * Processes incoming requests and establishes authentication
 * in the Spring Security context when a valid token is present.
 * </p>
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final TokenBlacklistRepository tokenBlacklistRepository;


    /**
     * Creates a JWT authentication filter.
     *
     * @param jwtService service used for JWT operations
     * @param userService service used to load user details
     * @param tokenBlacklistRepository repository storing revoked tokens
     */
    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserService userService,
                                   TokenBlacklistRepository tokenBlacklistRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    /**
     * Filters an HTTP request and applies JWT authentication if applicable.
     *
     * @param request HTTP request
     * @param response HTTP response
     * @param filterChain filter chain
     * @throws ServletException if a servlet error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String userId = jwtService.extractId(token);

        if (userId != null && jwtService.isTokenValid(token)
        && !tokenBlacklistRepository.existsByToken(token)) {
            UserDetails userDetails = userService.loadUserById(Long.parseLong(userId));

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}