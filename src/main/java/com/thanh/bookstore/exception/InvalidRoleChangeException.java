package com.thanh.bookstore.exception;

/**
 * Exception thrown when a role change would leave the system in
 * an invalid state — e.g. self-demotion or removing the last admin.
 */
public class InvalidRoleChangeException extends RuntimeException {

    public InvalidRoleChangeException(String message) {
        super(message);
    }
}