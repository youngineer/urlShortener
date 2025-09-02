package com.youngineer.backend.controller;


import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.authDto.SignupRequest;
import com.youngineer.backend.services.AuthService;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
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
        System.out.println("Entered controller");
        try {
            ResponseDto serviceResponse = authService.signupService(signupRequest);
            if(serviceResponse.message().equals("OK")) return ResponseEntity.status(HttpStatus.CREATED).body(serviceResponse);

            throw new Exception(serviceResponse.message());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ResponseDto(e.getMessage(), null));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto("An unexpected error occurred: " + e.getMessage(), null));
        }
    }
}
