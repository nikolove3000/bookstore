package com.thanh.bookstore.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thanh.bookstore.dto.ChangePasswordRequest;
import com.thanh.bookstore.dto.LoginRequest;
import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.dto.ProfileDto;
import com.thanh.bookstore.dto.RegisterRequest;
import com.thanh.bookstore.dto.RegisterResponse;
import com.thanh.bookstore.dto.UpdateProfileRequest;
import com.thanh.bookstore.entity.RefreshToken;
import com.thanh.bookstore.entity.TokenBlacklist;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.enums.Role;
import com.thanh.bookstore.exception.DuplicateEmailException;
import com.thanh.bookstore.exception.DuplicateUsernameException;
import com.thanh.bookstore.exception.InvalidCredentialsException;
import com.thanh.bookstore.exception.InvalidPasswordException;
import com.thanh.bookstore.exception.UserNotFoundException;
import com.thanh.bookstore.repository.RefreshTokenRepository;
import com.thanh.bookstore.repository.TokenBlacklistRepository;
import com.thanh.bookstore.repository.UserRepository;
import com.thanh.bookstore.security.JwtService;
import com.thanh.bookstore.service.model.LoginResult;
import com.thanh.bookstore.service.model.TokenPair;

import jakarta.transaction.Transactional;

/**
 * Service responsible for user account management and authentication workflows.
 *
 * <p>
 * Role: Service Layer component.</p>
 *
 * <p>
 * Handles registration, authentication, JWT issuance, refresh token rotation,
 * token revocation, and user retrieval for security operations.</p>
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    /**
     * Creates the service with required persistence and security dependencies.
     *
     * @param userRepository repository managing users
     * @param passwordEncoder password hashing component
     * @param jwtService JWT issuing and validation service
     * @param refreshTokenRepository repository managing refresh tokens
     * @param tokenBlacklistRepository repository storing revoked tokens
     */
    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenRepository refreshTokenRepository,
            TokenBlacklistRepository tokenBlacklistRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    /**
     * Loads user details by username for authentication.
     *
     * @param username unique username
     * @return authenticated user details
     * @throws UserNotFoundException if the user does not exist
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Loads user details using the user identifier.
     *
     * @param id user identifier
     * @return user details
     * @throws UserNotFoundException if the user does not exist
     */
    public UserDetails loadUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User ID not found"));
    }

    /**
     * Finds a user by their username.
     *
     * @param username unique username
     * @return user entity
     * @throws UserNotFoundException if the user does not exist
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Registers a new user account.
     *
     * <p>
     * Ensures username and email uniqueness before persisting a new user with
     * default USER role.</p>
     *
     * @param request registration data
     * @return registration result containing created user information
     * @throws DuplicateUsernameException if username already exists
     * @throws DuplicateEmailException if email already exists
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
     * Authenticates a user and issues an access token.
     *
     * <p>
     * Supports authentication using username or email credentials. Returns
     * authenticated user context together with issued token data.</p>
     *
     * @param request login credentials
     * @return authentication result containing response payload and user
     * @throws UserNotFoundException if user cannot be located
     * @throws InvalidCredentialsException if password validation fails
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

    /**
     * Creates and persists a refresh token associated with a user.
     *
     * @param user authenticated user
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
     * Rotates refresh token and issues a new access token.
     *
     * <p>
     * Validates refresh token existence and expiration. The previous refresh
     * token is revoked and replaced with a newly issued token pair.</p>
     *
     * @param token refresh token provided by client
     * @return new access token and refresh token pair
     * @throws InvalidCredentialsException if token is missing or expired
     */
    public TokenPair refreshAccessToken(String token) {
        try {
            RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                    .orElseThrow(() -> new InvalidCredentialsException("Refresh token not found!"));

            if (refreshToken.getExpiredAt().isBefore(LocalDateTime.now())) {

                refreshTokenRepository.delete(refreshToken);
                throw new InvalidCredentialsException("Refresh token expired!");
            }

            User user = refreshToken.getUser();

            String newAccessToken = jwtService.generateToken(user);

            refreshTokenRepository.findById(refreshToken.getId())
                    .ifPresent(refreshTokenRepository::delete);

            RefreshToken newRefreshToken = createRefreshToken(user);

            return new TokenPair(newAccessToken, newRefreshToken.getToken(), user.getUsername(), user.getRole());
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new InvalidCredentialsException("Refresh token already used!");
        }
    }

    /**
     * Logs out a user by revoking authentication tokens.
     *
     * <p>
     * The access token is blacklisted and all refresh tokens associated with
     * the user are removed.</p>
     *
     * @param accessToken active access token
     * @param user authenticated user
     */
    @Transactional
    public void logout(String accessToken, User user) {

        blacklistToken(accessToken);
        refreshTokenRepository.deleteByUser(user);
    }

    /**
     * Adds an access token to the blacklist until its expiration time.
     *
     * @param token access token to revoke
     */
    public void blacklistToken(String token) {

        TokenBlacklist tokenBlacklist = new TokenBlacklist();
        tokenBlacklist.setToken(token);

        Date expirationDate = jwtService.extractExpiration(token);
        tokenBlacklist.setExpiredAt(expirationDate
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());

        tokenBlacklistRepository.save(tokenBlacklist);
    }

    /**
     * Returns profile information for the given user.
     *
     * @param user authenticated user
     * @return profile DTO
     */
    public ProfileDto getProfile(User user) {
        ProfileDto dto = new ProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRole(user.getRole().name());
        return dto;
    }

    /**
     * Updates mutable profile fields for the given user.
     *
     * @param user authenticated user
     * @param request updated profile fields
     * @return updated profile DTO
     * @throws DuplicateEmailException if the new email is already taken by
     * another user
     */
    @Transactional
    public ProfileDto updateProfile(User user, UpdateProfileRequest request) {
        if (request.getEmail() != null
                && !request.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use");
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        userRepository.save(user);
        return getProfile(user);
    }

    /**
     * Changes the password after verifying the current one.
     *
     * @param user authenticated user
     * @param request current and new password
     * @throws InvalidPasswordException if currentPassword does not match
     */
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
