package com.youngineer.backend.dto.urlDto;

public record UrlUpdateRequest(Long id, String name, String longUrl, String shortUrl, String customUrl) {
}
