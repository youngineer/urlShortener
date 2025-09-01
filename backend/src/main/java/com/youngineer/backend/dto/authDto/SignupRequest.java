package com.youngineer.backend.dto.authDto;

public class SignupRequest extends LoginRequest{
    private final String name;

    public SignupRequest(String name, String emailId, String password) {
        super(emailId, password);
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
