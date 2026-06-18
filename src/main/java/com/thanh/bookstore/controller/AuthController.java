package com.thanh.bookstore.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.LoginRequest;
import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.dto.RegisterRequest;
import com.thanh.bookstore.dto.RegisterResponse;
import com.thanh.bookstore.entity.RefreshToken;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.exception.InvalidCredentialsException;
import com.thanh.bookstore.service.UserService;
import com.thanh.bookstore.service.model.LoginResult;
import com.thanh.bookstore.service.model.TokenPair;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

/**
 * REST controller handling authentication and session lifecycle operations.
 *
 * <p>
 * Role: Controller Layer.</p>
 *
 * <p>
 * Provides endpoints for user registration, authentication, access token
 * issuance, refresh token rotation, and logout.</p>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /**
     * Creates the authentication controller.
     *
     * @param userService service responsible for authentication workflows
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registers a new user account.
     *
     * <p>
     * HTTP POST /api/auth/register</p>
     *
     * @param request registration payload
     * @return HTTP 201 response containing registered user information
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.created(null).body(userService.register(request));
    }

    /**
     * Authenticates a user and issues authentication tokens.
     *
     * <p>
     * HTTP POST /api/auth/login</p>
     *
     * <p>
     * Authenticates user credentials, returns an access token in the response
     * body, and issues a refresh token as a secure HttpOnly cookie.</p>
     *
     * @param request login credentials
     * @param response HTTP response used to attach refresh token cookie
     * @return HTTP 200 response containing access token information
     * @throws InvalidCredentialsException if authentication fails
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request, HttpServletResponse response) {

        LoginResult result = userService.login(request);
        RefreshToken refreshToken = userService.createRefreshToken(result.getUser());

        response.addHeader("Set-Cookie",
                "refresh_token=" + refreshToken.getToken()
                + "; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict");

        return ResponseEntity.ok(result.getLoginResponse());
    }

    /**
     * Rotates refresh token and issues a new access token.
     *
     * <p>
     * HTTP POST /api/auth/refresh</p>
     *
     * <p>
     * Extracts refresh token from cookies, validates it, issues a new access
     * token, and replaces the refresh token cookie.</p>
     *
     * @param request HTTP request containing refresh token cookie
     * @param response HTTP response used to update refresh token cookie
     * @return HTTP 200 response containing newly issued access token
     * @throws InvalidCredentialsException if refresh token is missing, invalid,
     * or expired
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {

        String token = null;
        if (request.getCookies() != null) {

            for (Cookie cookie : request.getCookies()) {

                if (cookie.getName().equals("refresh_token")) {

                    token = cookie.getValue();
                }
            }
        }

        if (token == null) {
            throw new InvalidCredentialsException("Refresh token is missing!");
        }

        TokenPair tokenPair = userService.refreshAccessToken(token);

        response.addHeader("Set-Cookie",
                "refresh_token=" + tokenPair.getRefreshToken()
                + "; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict");

        return ResponseEntity.ok(new LoginResponse(tokenPair.getUsername(), tokenPair.getAccessToken(), tokenPair.getRole()));
    }

    /**
     * Logs out the authenticated user and revokes tokens.
     *
     * <p>
     * HTTP POST /api/auth/logout</p>
     *
     * <p>
     * Revokes the current access token, deletes all refresh tokens associated
     * with the user, and clears the refresh token cookie.</p>
     *
     * @param request HTTP request containing authorization header and cookies
     * @param response HTTP response used to remove refresh token cookie
     * @return HTTP 204 No Content when logout succeeds
     * @throws InvalidCredentialsException if access token is missing or invalid
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.findByUsername(userDetails.getUsername());

        response.addHeader("Set-Cookie",
                "refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidCredentialsException("Access token missing!");
        }

        String accessToken = authHeader.substring(7);
        userService.logout(accessToken, user);

        return ResponseEntity.noContent().build();
    }
}
