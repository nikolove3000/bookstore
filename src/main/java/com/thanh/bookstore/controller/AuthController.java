package com.thanh.bookstore.controller;

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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication operations.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /**
     * Creates an AuthController.
     *
     * @param userService service handling authentication logic
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registers a new user account.
     *
     * @param request registration data
     * @return registered user information
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.created(null).body(userService.register(request));
    }

    /**
     * Authenticates a user and issues authentication tokens.
     *
     * @param request login credentials
     * @param response HTTP response used to attach refresh token cookie
     * @return access token response
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request, HttpServletResponse response) {

        LoginResult result = userService.login(request);
        RefreshToken refreshToken = userService.createRefreshToken(result.getUser());

        response.addHeader("Set-Cookie",
                "refresh_token=" + refreshToken.getToken()
                        + "; HttpOnly; Secure; Path=/; Max-Age=604800; SameSite=Strict");

        return ResponseEntity.ok(result.getLoginResponse());
    }

    /**
     * Refreshes the access token using the refresh token stored in cookies.
     *
     * <p>The endpoint extracts the refresh token from the HTTP cookie,
     * validates it, and issues a new access token along with a rotated
     * refresh token. The new refresh token is returned as a secure
     * HttpOnly cookie.</p>
     *
     * @param request the HTTP request containing cookies
     * @param response the HTTP response used to update the refresh token cookie
     * @return HTTP 200 response containing the new access token
     * @throws InvalidCredentialsException if the refresh token is missing,
     *                                     invalid, or expired
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
                        + "; HttpOnly; Secure; Path=/; Max-Age=604800; SameSite=Strict");

        return ResponseEntity.ok(tokenPair.getAccessToken());
    }

    /**
     * Logs out the currently authenticated user.
     *
     * <p>The endpoint revokes all refresh tokens associated with the user
     * and clears the refresh token cookie from the client.</p>
     *
     * @param request the HTTP request containing authentication information
     * @param response the HTTP response used to remove the refresh token cookie
     * @return HTTP 204 No Content when logout is successful
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("refresh_token")) {
                    token = cookie.getValue();
                }
            }
        }

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        response.addHeader("Set-Cookie",
                "refresh_token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Strict");

        userService.logout(user);

        return ResponseEntity.noContent().build();
    }

}