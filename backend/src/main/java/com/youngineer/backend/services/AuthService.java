package com.youngineer.backend.services;

import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.authDto.LoginRequest;
import com.youngineer.backend.dto.authDto.SignupRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    public ResponseDto signupService(SignupRequest signupRequest);
    public ResponseDto LoginService(LoginRequest loginRequest);
}
