package com.thanh.bookstore.exception;

/**
 * Exception thrown when requested quantity exceeds available stock.
 */
public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(String message) {
        super(message);
    }
}