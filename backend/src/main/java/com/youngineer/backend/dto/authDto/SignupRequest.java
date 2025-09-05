package com.youngineer.backend.dto.authDto;

public class SignupRequest extends LoginRequest{

    public SignupRequest(String emailId, String password) {
        super(emailId, password);
    }

}
