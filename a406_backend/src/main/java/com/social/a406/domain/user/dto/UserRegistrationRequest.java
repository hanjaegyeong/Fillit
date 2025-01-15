package com.social.a406.domain.user.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserRegistrationRequest extends RegistrationRequest {
    private String loginId;
    private String password;
}