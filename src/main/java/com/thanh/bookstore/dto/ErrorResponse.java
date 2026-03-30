package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Data Transfer Object representing an error response.
 *
 * <p>
 * Contains HTTP status code, error type, message, and timestamp.
 * </p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ErrorResponse {

    /** HTTP status code of the error. */
    private int status;

    /** Short description of the error type. */
    private String error;

    /** Detailed error message. */
    private String message;

    /** Timestamp when the error occurred. */
    private LocalDateTime timestamp;
}
