package com.youngineer.backend.controller;


import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.authDto.SignupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @PostMapping("/signup")
    public ResponseEntity<ResponseDto> signup(@Validated @RequestBody SignupRequest signupRequest) {

    }
}
