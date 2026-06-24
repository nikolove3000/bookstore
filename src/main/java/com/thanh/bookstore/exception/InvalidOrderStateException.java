package com.thanh.bookstore.exception;

/**
 * Exception thrown when an order operation is attempted in an
 * invalid state — e.g. cancelling an order that already shipped.
 */
public class InvalidOrderStateException extends RuntimeException {

    public InvalidOrderStateException(String message) {
        super(message);
    }
}