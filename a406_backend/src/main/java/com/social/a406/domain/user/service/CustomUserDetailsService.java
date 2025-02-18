package com.social.a406.domain.user.service;

import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.user.security.CustomUserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String personalId) throws UsernameNotFoundException {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with personalId: " + personalId));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new CustomUserDetails(
                user.getId(),  // User 고유 식별자
                user.getPersonalId(), // 닉네임으로 식별
                user.getPassword(),
                authorities
        );
    }

    public UserDetails loadUserByEmail(String Email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(Email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with Email: " + Email));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new CustomUserDetails(
                user.getId(),
                user.getPersonalId(),
                user.getPassword(),
                authorities
        );
    }

    public UserDetails loadSocialUserBySocialId(String socialId) throws UsernameNotFoundException {
        User user = userRepository.findBySocialId(socialId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with socialId: " + socialId));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new CustomUserDetails(
                user.getId(),
                user.getPersonalId(),
                "oauth", // 소셜 로그인은 비밀번호가 없으므로 대체 문자열 사용
                authorities
        );
    }

    public UserDetails loadUserByPersonalId(String personalId) throws UsernameNotFoundException {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with personalId: " + personalId));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new CustomUserDetails(
                user.getId(),
                user.getPersonalId(),
                user.getPassword(),
                authorities
        );
    }
}
