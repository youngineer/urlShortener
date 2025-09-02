package com.youngineer.backend.services.implementations;

import com.sun.jdi.request.DuplicateRequestException;
import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.authDto.LoginRequest;
import com.youngineer.backend.dto.authDto.SignupRequest;
import com.youngineer.backend.models.User;
import com.youngineer.backend.repository.UserRepository;
import com.youngineer.backend.services.AuthService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public ResponseDto signupService(SignupRequest signupRequest) {
        if (signupRequest == null) {
            return new ResponseDto("Invalid user data", null);
        }

        String emailId = signupRequest.getEmailId();

        try {
            Boolean isEmailRegistered = userRepository.existsByEmailId(emailId);
            if(isEmailRegistered) {
                throw new DuplicateRequestException("Email already registered");
            } else {
                User user = convertToUserEntity(signupRequest);
                userRepository.save(user);
                return new ResponseDto("OK", "Signup successful! Please login");
            }

        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), e.getMessage());
        }
    }

    @Override
    public ResponseDto LoginService(LoginRequest loginRequest) {
        String emailId = loginRequest.getEmailId();
        String password = loginRequest.getPassword();

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(emailId, password));


        }
    }

    private User convertToUserEntity(SignupRequest signupRequest) {
        String emailId = signupRequest.getEmailId();
        String password = signupRequest.getPassword();
        String name = signupRequest.getName();
        String passwordHash = encodePassword(password);

        User user = new User();
        user.setName(name);
        user.setPassword(passwordHash);
        user.setEmailId(emailId);

        return user;
    }

    private String encodePassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(10));
    }

    private Boolean verifyPassword(String userPassword, String passwordHash) {
        return BCrypt.checkpw(userPassword, passwordHash);
    }
}
