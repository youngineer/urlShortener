package com.youngineer.backend.dto.authDto;

public class LoginRequest {
    private final String emailId;
    private final String password;

    public LoginRequest(String emailId, String password) {
        this.emailId = emailId;
        this.password = password;
    }

    public String getEmailId() {
        return emailId;
    }

    public String getPassword() {
        return password;
    }
}
