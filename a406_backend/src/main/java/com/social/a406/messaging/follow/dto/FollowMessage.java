package com.social.a406.messaging.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowMessage {
    private String myPersonalId;
    private String otherPersonalId;
}
