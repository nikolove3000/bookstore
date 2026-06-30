package com.thanh.bookstore.exception;

/**
 * Exception thrown when a user attempts to review a book they
 * have not purchased.
 */
public class ReviewNotEligibleException extends RuntimeException {

    public ReviewNotEligibleException(String message) {
        super(message);
    }
}