package com.thanh.bookstore.service;

import com.thanh.bookstore.dto.LoginRequest;
import com.thanh.bookstore.dto.LoginResponse;
import com.thanh.bookstore.dto.RegisterRequest;
import com.thanh.bookstore.dto.RegisterResponse;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.entity.enums.Role;
import com.thanh.bookstore.repository.UserRepository;
import com.thanh.bookstore.security.JwtService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for managing user accounts and authentication.
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
     * Loads a user by username for authentication.
     *
     * @param username the username
     * @return authenticated user details
     * @throws UsernameNotFoundException if the user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found!"));
    }

    /**
     * Registers a new user account.
     *
     * @param request registration data
     * @return registered user information
     * @throws RuntimeException if username or email already exists
     */
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())
                || userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Username hoac email da ton tai!");
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
     * Authenticates a user and returns an access token.
     *
     * @param request login credentials
     * @return authentication result containing token and role
     * @throws RuntimeException if credentials are invalid
     */
    public LoginResponse login(LoginRequest request) {

        User user = request.getUsernameOrEmail().contains("@")
                ? userRepository.findByEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Khong tim thay email!"))
                : userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Khong tim thay username"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mat khau!");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(user.getUsername(), token, user.getRole());
    }
}