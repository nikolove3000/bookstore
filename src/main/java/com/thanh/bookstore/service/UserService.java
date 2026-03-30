package com.thanh.bookstore.service;

import com.thanh.bookstore.dto.LoginRequest;
import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.dto.RegisterRequest;
import com.thanh.bookstore.dto.RegisterResponse;
import com.thanh.bookstore.entity.RefreshToken;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.enums.Role;
import com.thanh.bookstore.exception.DuplicateEmailException;
import com.thanh.bookstore.exception.DuplicateUsernameException;
import com.thanh.bookstore.exception.InvalidCredentialsException;
import com.thanh.bookstore.exception.UserNotFoundException;
import com.thanh.bookstore.service.model.LoginResult;
import com.thanh.bookstore.repository.RefreshTokenRepository;
import com.thanh.bookstore.repository.UserRepository;
import com.thanh.bookstore.security.JwtService;
import com.thanh.bookstore.service.model.TokenPair;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for managing user accounts, authentication, and refresh tokens.
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Constructs a UserService with required dependencies.
     *
     * @param userRepository repository for user persistence
     * @param passwordEncoder encoder for password hashing
     * @param jwtService service for JWT operations
     * @param refreshTokenRepository repository for refresh token persistence
     */
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /** Loads a user by username.
     * @param username the username
     * @return user details
     * @throws UserNotFoundException if the user does not exist
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /** Loads a user by ID.
     * @param id user ID
     * @return user details
     * @throws UserNotFoundException if the user does not exist
     */
    public UserDetails loadUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User ID not found"));
    }

    /** Registers a new user.
     * @param request registration data
     * @return registered user info
     * @throws DuplicateUsernameException if username exists
     * @throws DuplicateEmailException if email exists
     */
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUsernameException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }

        User user = new User();
        user.setAddress(request.getAddress());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);
        return new RegisterResponse(user.getUsername(), user.getEmail());
    }

    /**
     * Authenticates a user and generates an access token.
     *
     * @param request login credentials
     * @return login result containing response data and authenticated user
     * @throws UserNotFoundException if the user does not exist
     * @throws InvalidCredentialsException if the password is invalid
     */
    public LoginResult login(LoginRequest request) {
        User user = request.getUsernameOrEmail().contains("@")
                ? userRepository.findByEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not found"))
                : userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = jwtService.generateToken(user);
        LoginResponse loginResponse = new LoginResponse(user.getUsername(), token, user.getRole());
        return new LoginResult(loginResponse, user);
    }

    /** Creates a refresh token for a user.
     * @param user the user
     * @return persisted refresh token
     */
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshToken.setExpiredAt(LocalDateTime.now().plusDays(7));
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Generates a new access token using a valid refresh token.
     *
     * <p>The provided refresh token is validated for existence and expiration.
     * If valid, the old refresh token is revoked and a new token pair
     * (access token and refresh token) is issued.</p>
     *
     * @param token the refresh token issued during authentication
     * @return a {@link TokenPair} containing the new access token and refresh token
     * @throws InvalidCredentialsException if the refresh token does not exist
     *                                     or has expired
     */
    public TokenPair refreshAccessToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow( () -> new InvalidCredentialsException("Refresh token not found!"));

        if (refreshToken.getExpiredAt().isBefore(LocalDateTime.now())) {

            refreshTokenRepository.delete(refreshToken);
            throw new InvalidCredentialsException("Refresh token expired!");
        }

        User user = refreshToken.getUser();

        String newAccessToken = jwtService.generateToken(user);

        refreshTokenRepository.delete(refreshToken);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return new TokenPair(newAccessToken, newRefreshToken.getToken());
    }

    /**
     * Logs out the specified user by revoking all associated refresh tokens.
     *
     * <p>After logout, existing refresh tokens can no longer be used
     * to obtain new access tokens.</p>
     *
     * @param user the authenticated user to be logged out
     */
    public void logout(User user) {

        refreshTokenRepository.deleteByUser(user);
    }
}