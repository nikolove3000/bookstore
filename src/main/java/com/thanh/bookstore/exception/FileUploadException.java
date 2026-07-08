package com.thanh.bookstore.exception;

/**
 * Exception thrown when a file upload operation fails.
 */
public class FileUploadException extends RuntimeException {

    public FileUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}