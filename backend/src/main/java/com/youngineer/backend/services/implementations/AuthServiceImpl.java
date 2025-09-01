package com.youngineer.backend.services.implementations;

import com.sun.jdi.request.DuplicateRequestException;
import com.youngineer.backend.dto.authDto.LoginRequest;
import com.youngineer.backend.dto.authDto.SignupRequest;
import com.youngineer.backend.models.User;
import com.youngineer.backend.repository.UserRepository;
import com.youngineer.backend.services.AuthService;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String signupService(SignupRequest signupRequest) {
        if (signupRequest == null) {
            return "Invalid user data";
        }

        String emailId = signupRequest.getEmailId();

        try {
            Boolean isEmailRegistered = userRepository.existsByEmailId(emailId);
            if(isEmailRegistered) {
                throw new DuplicateRequestException("Email already registered");
            } else {
                User user = convertToUserEntity(signupRequest);
                userRepository.save(user);
                return "Signup Successful! Please login";
            }

        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @Override
    public String LoginService(LoginRequest loginRequest) {
        return "";
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
