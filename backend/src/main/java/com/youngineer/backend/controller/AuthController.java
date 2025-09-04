package com.youngineer.backend.controller;


import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.authDto.LoginRequest;
import com.youngineer.backend.dto.authDto.SignupRequest;
import com.youngineer.backend.services.AuthService;
import com.youngineer.backend.utils.JwtHelper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@CrossOrigin(origins = "${frontend.url}")
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
    }
    @PostMapping("/signup")
    public ResponseEntity<ResponseDto> signup(@Validated @RequestBody SignupRequest signupRequest) {
        try {
            ResponseDto serviceResponse = authService.signupService(signupRequest);
            if(serviceResponse.message().equals("OK")) return ResponseEntity.status(HttpStatus.CREATED).body(serviceResponse);

            throw new Exception(serviceResponse.message());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ResponseDto(e.getMessage(), null));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto("An unexpected error occurred: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> userLogin(@Validated @RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmailId(), request.getPassword()));

            if (authentication.isAuthenticated()) {
                String accessToken = JwtHelper.generateToken(request.getEmailId());

                ResponseCookie cookie = ResponseCookie.from("token", accessToken)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(Duration.ofHours(1))
                        .build();
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                ResponseDto responseDto = new ResponseDto("OK", "Login successful!");
                return ResponseEntity.ok(responseDto);
            } else {
                throw new BadCredentialsException("Error authenticating the user");
            }
        } catch (BadCredentialsException | UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body(new ResponseDto("Invalid credentials", null));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto("Authentication failed", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto("An unexpected error occurred: " + e.getMessage(), null));
        }
    }
}
