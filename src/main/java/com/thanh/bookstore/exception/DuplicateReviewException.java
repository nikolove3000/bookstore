package com.thanh.bookstore.exception;

/**
 * Exception thrown when a user attempts to review the same book twice.
 */
public class DuplicateReviewException extends RuntimeException {

    public DuplicateReviewException(String message) {
        super(message);
    }
}