package com.social.a406.domain.auth.service;

import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.user.service.CustomUserDetailsService;
import com.social.a406.util.JwtTokenUtil;
import com.social.a406.util.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    public String createAccessToken(String personalId){
        User user = userRepository.findByPersonalId(personalId).orElseThrow(
                () -> new ForbiddenException("Not found user"));

        UserDetails userDetails = null;
        if(user.getEmail() != null) {
            userDetails = customUserDetailsService.loadUserByEmail(user.getEmail());
        }else{
            userDetails = customUserDetailsService.loadSocialUserBySocialId(user.getSocialId());
        }

        return jwtTokenUtil.generateToken(userDetails);
    }
}
