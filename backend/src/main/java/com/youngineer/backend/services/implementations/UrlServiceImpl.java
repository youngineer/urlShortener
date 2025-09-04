package com.youngineer.backend.services.implementations;

import com.youngineer.backend.dto.ResponseDto;
import com.youngineer.backend.dto.urlDto.UrlDeleteRequest;
import com.youngineer.backend.dto.urlDto.UrlResponseDto;
import com.youngineer.backend.dto.urlDto.UrlShortenRequest;
import com.youngineer.backend.dto.urlDto.UrlUpdateRequest;
import com.youngineer.backend.models.Url;
import com.youngineer.backend.models.User;
import com.youngineer.backend.repository.UrlRepository;
import com.youngineer.backend.repository.UserRepository;
import com.youngineer.backend.services.UrlService;
import com.youngineer.backend.utils.JwtHelper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UrlServiceImpl implements UrlService {
    private static final String SHORT_BASE_URL = "https://kr.pt/";
    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    public UrlServiceImpl(UrlRepository urlRepository, UserRepository userRepository) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseDto getUserUrlList(HttpServletRequest request) {
        try {
            User user = getUser(request);
            List<Url> urlList = urlRepository.findAllByUserOrderByCreatedAtDesc(user);
            if(urlList.isEmpty()) return new ResponseDto("OK", "Create an url");

            List<UrlResponseDto> urlResponseDtoList = new ArrayList<>();
            for(Url url: urlList) {
                UrlResponseDto urlResponseDto = new UrlResponseDto(url.getId(), url.getName(), url.getLongUrl(), url.getShortUrl(), url.getCustomUrl());
                urlResponseDtoList.add(urlResponseDto);
            }

            return new ResponseDto("OK", urlResponseDtoList);
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), null);
        }
    }

    @Override
    public ResponseDto shortenUrl(UrlShortenRequest urlShortenRequest, HttpServletRequest request){
        try {
            User user = getUser(request);
            String longUrl = urlShortenRequest.longUrl();
            String name = urlShortenRequest.name().isEmpty() ? longUrl : urlShortenRequest.name();
            String shortUrl = SHORT_BASE_URL + getCrc32(longUrl);
            String customUrl = urlShortenRequest.customUrl().isEmpty() ? shortUrl : urlShortenRequest.customUrl();

            Optional<Url> optionalUrl = urlRepository.findByLongUrlAndUser(longUrl, user);
            if(optionalUrl.isPresent()) {
                Url url = optionalUrl.get();
                return new ResponseDto("OK", new UrlResponseDto(url.getId(), url.getName(), url.getLongUrl(), url.getShortUrl(), url.getCustomUrl()));
            } else {
                Url url = convertToUrlEntity(name, user, longUrl, shortUrl, customUrl);
                urlRepository.save(url);
                return new ResponseDto("OK", getUserUrlList(request));
            }
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), null);
        }
    }

    @Override
    public ResponseDto updateUrl(UrlUpdateRequest urlUpdateRequest, HttpServletRequest request) {
        try {
            User user = getUser(request);
            Optional<Url> optionalPrevStoredUrl = urlRepository.findById(urlUpdateRequest.id());
            if(optionalPrevStoredUrl.isEmpty()) throw new EntityNotFoundException("No such url created");

            Url prevStoredUrl = optionalPrevStoredUrl.get();
            String shortUrl = prevStoredUrl.getShortUrl();
            String longUrl = urlUpdateRequest.longUrl().isEmpty() ? prevStoredUrl.getLongUrl() : urlUpdateRequest.longUrl();
            String name = urlUpdateRequest.name().isEmpty() ? prevStoredUrl.getName() : urlUpdateRequest.name();
            String customUrl = urlUpdateRequest.customUrl().isEmpty() ? prevStoredUrl.getCustomUrl() : urlUpdateRequest.customUrl();

            Url updatedUrl = convertToUrlEntity(name, user, longUrl, shortUrl, customUrl);
            updatedUrl.setId(prevStoredUrl.getId());
            urlRepository.save(updatedUrl);

            return getUserUrlList(request);

        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), null);
        }
    }

    @Override
    public ResponseDto deleteUrl(UrlDeleteRequest urlDeleteRequest, HttpServletRequest request) {
        System.out.println(urlDeleteRequest.id());
        try {
            User user = getUser(request);
            urlRepository.deleteById(urlDeleteRequest.id());

            return getUserUrlList(request);
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), null);
        }
    }


    private Url convertToUrlEntity(String name, User user, String longUrl, String shortUrl, String customUrl) {
        Url url = new Url();
        url.setLongUrl(longUrl);
        url.setShortUrl(shortUrl);
        url.setCustomUrl(customUrl);
        url.setName(name);
        LocalDateTime time = LocalDateTime.now();
        url.setCreatedAt(time);
        url.setUpdatedAt(time);
        url.setUser(user);

        return url;
    }

    private String getCrc32(String url) {
        int crc  = 0xFFFFFFFF;
        int poly = 0xEDB88320;
        byte[] bytes = url.getBytes();

        for (byte b : bytes) {
            int temp = (crc ^ b) & 0xff;

            for (int i = 0; i < 8; i++) {
                if ((temp & 1) == 1) temp = (temp >>> 1) ^ poly;
                else                 temp = (temp >>> 1);
            }
            crc = (crc >>> 8) ^ temp;
        }
        crc = ~crc;

        return Integer.toHexString(crc);
    }

    private User getUser(HttpServletRequest request) {
        try {
            String emailId = JwtHelper.getEmailId(request);
            Optional<User> userOptional = userRepository.findByEmailId(emailId);
            if(userOptional.isEmpty()) throw new EntityNotFoundException("No such email present");

            return userOptional.get();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
