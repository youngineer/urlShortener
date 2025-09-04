package com.youngineer.backend.utils;

import com.youngineer.backend.models.User;
import com.youngineer.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;

import java.nio.charset.StandardCharsets;
import java.rmi.NoSuchObjectException;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

public class JwtHelper {
    private static final Integer EXPIRATION_MINUTES = 60;
    private static final String SECRET_KEY_STRING = System.getenv("JWT_SECRET_KEY");
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));

    public static String generateToken(String emailId) {
        var now = Instant.now();

        return Jwts.builder()
                .subject(emailId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(EXPIRATION_MINUTES, ChronoUnit.MINUTES)))
                .signWith(SECRET_KEY)
                .compact();
    }

    public static String extractEmailId(String token) {
        return getTokenBody(token).getSubject();
    }

    public static String getEmailId(HttpServletRequest request) {
        try {
            for(Cookie cookie: request.getCookies()) {
                if("token".equals(cookie.getName())) {
                    return extractEmailId(cookie.getValue());

                }
                throw new NoSuchObjectException("Email not found");
            }

            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static Boolean validateToken(String token, String emailId) {
        final String userEmailId = extractEmailId(token);
        return userEmailId.equals(emailId) && !isTokenExpired(token);
    }

    private static Claims getTokenBody(String token) {
        try {
            return Jwts
                    .parser()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SignatureException | ExpiredJwtException e) {
            throw new AccessDeniedException("Access denied: " + e.getMessage());
        }
    }

    private static boolean isTokenExpired(String token) {
        Claims claims = getTokenBody(token);
        return claims.getExpiration().before(new Date());
    }
}
