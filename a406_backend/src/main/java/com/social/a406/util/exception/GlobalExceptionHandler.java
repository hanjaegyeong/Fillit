package com.social.a406.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<String> handleDuplicateException(DuplicateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
}
