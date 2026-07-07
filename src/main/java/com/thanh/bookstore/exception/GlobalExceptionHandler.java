package com.thanh.bookstore.exception;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.thanh.bookstore.dto.ErrorResponse;

/**
 * Global exception handler for REST controllers.
 *
 * <p>
 * Intercepts custom exceptions and returns {@link ErrorResponse} with
 * appropriate HTTP status codes and messages.
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles duplicate username errors.
     */
    @ExceptionHandler(DuplicateUsernameException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUsername(DuplicateUsernameException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                400, "DUPLICATE_USERNAME", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(400).body(errorResponse);
    }

    /**
     * Handles duplicate email errors.
     */
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(DuplicateEmailException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                400, "DUPLICATE_EMAIL", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(400).body(errorResponse);
    }

    /**
     * Handles user not found errors.
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                404, "USER_NOT_FOUND", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(404).body(errorResponse);
    }

    /**
     * Handles invalid login credentials.
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                401, "INVALID_CREDENTIALS", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(401).body(errorResponse);
    }

    /**
     * Handles @Valid validation errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");

        ErrorResponse errorResponse = new ErrorResponse(
                400, "VALIDATION_ERROR", errorMessage, LocalDateTime.now()
        );
        return ResponseEntity.status(400).body(errorResponse);
    }

    /**
     * Handles resource not found errors.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                404, "RESOURCE_NOT_FOUND", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(404).body(errorResponse);
    }

    /**
     * Handles insufficient stock errors.
     */
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientStock(InsufficientStockException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                409, "INSUFFICIENT_STOCK", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(409).body(errorResponse);
    }

    /**
     * Handles checkout attempts with an empty cart.
     */
    @ExceptionHandler(EmptyCartException.class)
    public ResponseEntity<ErrorResponse> handleEmptyCart(EmptyCartException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                400, "EMPTY_CART", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(400).body(errorResponse);
    }

    /**
     * Handles invalid order state transitions.
     */
    @ExceptionHandler(InvalidOrderStateException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOrderState(InvalidOrderStateException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                409, "INVALID_ORDER_STATE", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(409).body(errorResponse);
    }

    /**
     * Handles reviews attempted without a verified purchase.
     */
    @ExceptionHandler(ReviewNotEligibleException.class)
    public ResponseEntity<ErrorResponse> handleReviewNotEligible(ReviewNotEligibleException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                403, "REVIEW_NOT_ELIGIBLE", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(403).body(errorResponse);
    }

    /**
     * Handles duplicate review attempts.
     */
    @ExceptionHandler(DuplicateReviewException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateReview(DuplicateReviewException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                409, "DUPLICATE_REVIEW", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(409).body(errorResponse);
    }

    /**
     * Handles incorrect current password on password change.
     */
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPassword(InvalidPasswordException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                400, "INVALID_PASSWORD", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(400).body(errorResponse);
    }

    /**
     * Handles duplicate ISBN on book create/update.
     */
    @ExceptionHandler(jakarta.persistence.EntityExistsException.class)
    public ResponseEntity<ErrorResponse> handleEntityExists(jakarta.persistence.EntityExistsException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                409, "ENTITY_EXISTS", e.getMessage(), LocalDateTime.now()
        );
        return ResponseEntity.status(409).body(errorResponse);
    }

    /**
     * Handles deletion attempts blocked by foreign key constraints.
     */
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                409, "REFERENCED_ENTITY", "Cannot delete: this book is referenced by existing orders or reviews", LocalDateTime.now()
        );
        return ResponseEntity.status(409).body(errorResponse);
    }
}
