package com.social.a406.domain.user.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class UserUpdateRequest {
    String name;
    String introduction;
    List<String> interests;
}
