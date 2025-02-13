package com.social.a406.util.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
@ResponseStatus(HttpStatus.CONFLICT)
// HTTP 409 Conflict
public class DuplicateException extends RuntimeException {
    public DuplicateException(String message) {
        super(message);
        log.error("Duplicate Error : {}", message, this);
    }
}