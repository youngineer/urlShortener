package com.youngineer.backend.controller;

import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.urlDto.UrlShortenRequest;
import com.youngineer.backend.services.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/url")
public class UrlController {
    private final UrlService urlService;
    private final AuthenticationManager authenticationManager;

    public UrlController(AuthenticationManager authenticationManager, UrlService urlService) {
        this.authenticationManager = authenticationManager;
        this.urlService = urlService;
    }

    @GetMapping("/")
    public ResponseEntity<ResponseDto> getUserUrlList(HttpServletRequest request) {
        try {
            return ResponseEntity.ok(urlService.getUserUrlList(request));
        } catch (Exception e) {
            return (ResponseEntity<ResponseDto>) ResponseEntity.status(500);
        }
    }

    @PostMapping("/shortenUrl")
    public ResponseEntity<ResponseDto> shortenUrl(@RequestBody UrlShortenRequest urlShortenRequest, HttpServletRequest request) {
        try {
            return ResponseEntity.ok(urlService.shortenUrl(urlShortenRequest, request));
        } catch (Exception e) {
            return (ResponseEntity<ResponseDto>) ResponseEntity.status(500);
        }
    }

    @PatchMapping("/updateUrl")
    public ResponseEntity<ResponseDto> updateUrl(@RequestBody UrlShortenRequest urlShortenRequest, HttpServletRequest request) {
        try {
            return ResponseEntity.ok(urlService.updateUrl(urlShortenRequest, request));
        } catch (Exception e) {
            return (ResponseEntity<ResponseDto>) ResponseEntity.status(500);
        }
    }
}
