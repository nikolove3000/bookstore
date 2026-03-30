package com.thanh.bookstore.service;

import com.thanh.bookstore.dto.LoginRequest;
import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.dto.RegisterRequest;
import com.thanh.bookstore.dto.RegisterResponse;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.enums.Role;
import com.thanh.bookstore.exception.DuplicateEmailException;
import com.thanh.bookstore.exception.DuplicateUsernameException;
import com.thanh.bookstore.exception.InvalidCredentialsException;
import com.thanh.bookstore.exception.UserNotFoundException;
import com.thanh.bookstore.repository.UserRepository;
import com.thanh.bookstore.security.JwtService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for managing user accounts and authentication.
 *
 * <p>Provides operations for user registration, login, and user retrieval.</p>
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Creates a UserService with required dependencies.
     *
     * @param userRepository repository for user persistence
     * @param passwordEncoder encoder for password hashing
     * @param jwtService service for JWT operations
     */
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Loads a user by username.
     *
     * @param username the username
     * @return authenticated user details
     * @throws UserNotFoundException if the user does not exist
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Loads a user by ID.
     *
     * @param id user ID
     * @return user details
     * @throws UserNotFoundException if the user does not exist
     */
    public UserDetails loadUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User ID not found"));
    }

    /**
     * Registers a new user.
     *
     * @param request registration data
     * @return registered user information
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

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setAddress(request.getAddress());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setUsername(request.getUsername());
        user.setPasswordHash(hashedPassword);
        user.setRole(Role.USER);

        userRepository.save(user);

        return new RegisterResponse(user.getUsername(), user.getEmail());
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request login credentials
     * @return authentication result containing token and role
     * @throws UserNotFoundException if user not found
     * @throws InvalidCredentialsException if password is invalid
     */
    public LoginResponse login(LoginRequest request) {

        User user = request.getUsernameOrEmail().contains("@")
                ? userRepository.findByEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not found"))
                : userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(user.getUsername(), token, user.getRole());
    }
}