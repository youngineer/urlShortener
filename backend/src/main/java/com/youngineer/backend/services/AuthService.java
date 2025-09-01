package com.youngineer.backend.services;

import com.youngineer.backend.dto.authDto.LoginRequest;
import com.youngineer.backend.dto.authDto.SignupRequest;

public interface AuthService {
    public String signupService(SignupRequest signupRequest);
    public String LoginService(LoginRequest loginRequest);
}
