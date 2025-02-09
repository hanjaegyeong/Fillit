package com.social.a406.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
// HTTP 409 Conflict
public class DuplicateException extends RuntimeException {
    public DuplicateException(String message) {
        super(message);
    }
}