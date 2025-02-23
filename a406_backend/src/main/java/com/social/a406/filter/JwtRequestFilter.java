package com.social.a406.filter;

import com.social.a406.constants.SecurityConstants;
import com.social.a406.util.JwtTokenUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    public JwtRequestFilter(JwtTokenUtil jwtTokenUtil, UserDetailsService userDetailsService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // 화이트리스트 경로 체크 (SecurityConstants 사용)
        String servletPath = request.getServletPath();
        if (isWhitelisted(servletPath)) {
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // JWT 토큰이 Authorization 헤더에 있는지 확인
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);  // "Bearer " 접두사 제거
            try {
                username = jwtTokenUtil.extractUsername(jwt); // JWT에서 사용자 이름 추출
            } catch (ExpiredJwtException e) {
                // JWT가 만료된 경우 401 응답 반환
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Access token expired");
                return;
            }
        }

        // username이 있고, SecurityContext에 인증 정보가 없으면 JWT 검증 진행
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        chain.doFilter(request, response);
    }

    /**
     * 요청 경로가 화이트리스트에 포함되었는지 확인합니다.
     * 엔드포인트 패턴이 Ant 스타일("/**")일 경우, 접두어 비교로 체크합니다.
     */
    private boolean isWhitelisted(String path) {
        for (String whitePath : SecurityConstants.WHITELIST) {
            if (whitePath.endsWith("/**")) {
                // "/**" 제거하고 접두어 체크
                String trimmed = whitePath.substring(0, whitePath.length() - 3);
                if (path.startsWith(trimmed)) {
                    return true;
                }
            } else if (path.equals(whitePath)) {
                return true;
            }
        }
        return false;
    }
}
