package com.social.a406.domain.user.service;

import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByLoginId(loginId);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with loginId: " + loginId);
        }

        // 사용자 권한 설정
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new org.springframework.security.core.userdetails.User(
                user.get().getLoginId(),
                user.get().getPassword(),
                authorities
        );
    }

    public UserDetails loadSocialUserBySocialId(String socialId) throws UsernameNotFoundException{
        Optional<User> user = userRepository.findBySocialId(socialId);

        if(user.isEmpty()){
            throw new UsernameNotFoundException("User not found with socialId "+socialId);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new org.springframework.security.core.userdetails.User(
                user.get().getSocialId(),
                "oauth",
                authorities
        );
    }
}
