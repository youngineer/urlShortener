package com.youngineer.backend.services;

import com.youngineer.backend.dto.authDto.LoginRequest;
import com.youngineer.backend.dto.authDto.SignupRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    public String signupService(SignupRequest signupRequest);
    public String LoginService(LoginRequest loginRequest);
}
