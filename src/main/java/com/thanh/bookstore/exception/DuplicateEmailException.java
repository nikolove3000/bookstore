package com.thanh.bookstore.exception;

public class DuplicateEmailException extends RuntimeException{

    public DuplicateEmailException(String message) {

        super(message);
    }
}
