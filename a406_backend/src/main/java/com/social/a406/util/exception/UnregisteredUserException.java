package com.social.a406.util.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnregisteredUserException extends RuntimeException {
    public UnregisteredUserException(String message) {
        super(message);
        log.error("Unregistered Error : {}", message, this);
    }
}
