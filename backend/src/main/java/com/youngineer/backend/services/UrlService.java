package com.youngineer.backend.services;


import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.urlDto.UrlDeleteRequest;
import com.youngineer.backend.dto.urlDto.UrlShortenRequest;
import com.youngineer.backend.dto.urlDto.UrlUpdateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface UrlService {
    public ResponseDto getUserUrlList(HttpServletRequest request);
    public ResponseDto shortenUrl(UrlShortenRequest urlShortenRequest, HttpServletRequest request);
    public ResponseDto updateUrl(UrlUpdateRequest urlUpdateRequest, HttpServletRequest request);
    public ResponseDto deleteUrl(UrlDeleteRequest urlDeleteRequest, HttpServletRequest request);
}
