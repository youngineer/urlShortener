package com.youngineer.backend.services;


import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.urlDto.UrlShortenRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface UrlService {
    public ResponseDto getUserUrlList(HttpServletRequest request);
    public ResponseDto shortenUrl(UrlShortenRequest urlShortenRequest, HttpServletRequest request);
    public ResponseDto updateUrl(UrlShortenRequest urlShortenRequest, HttpServletRequest request);
}
