package com.youngineer.backend.controller;


import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.authDto.SignupRequest;
import com.youngineer.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/signup")
    public ResponseEntity<ResponseDto> signup(@Validated @RequestBody SignupRequest signupRequest) {
        ResponseEntity responseEntity = new ResponseEntity<>()
    }
}
