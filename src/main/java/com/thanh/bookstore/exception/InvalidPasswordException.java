package com.thanh.bookstore.exception;

/**
 * Exception thrown when current password verification fails.
 */
public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException(String message) {
        super(message);
    }
}