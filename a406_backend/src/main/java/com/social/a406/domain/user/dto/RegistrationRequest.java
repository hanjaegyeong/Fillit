package com.social.a406.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

import java.util.Date;

@Data
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type" // JSON 데이터에서 "type" 필드로 클래스 구분
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = UserRegistrationRequest.class, name = "user"),
        @JsonSubTypes.Type(value = SocialUserRegistrationRequest.class, name = "social")
})
public abstract class RegistrationRequest {
    private String name;
    private String nickname;
    private Date birthDate;
    private String email;
    private String profileImageUrl;
    private String introduction;
}