package com.youngineer.backend.services.implementations;

import com.sun.jdi.request.DuplicateRequestException;
import com.sun.jdi.request.InvalidRequestStateException;
import com.youngineer.backend.dto.ResponseDto;
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

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.zip.CRC32;


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
            List<Url> urlList = urlRepository.findAllByUserOrderByCreatedAtAsc(user);
            if(urlList.isEmpty()) return new ResponseDto("OK", null);

            List<UrlResponseDto> urlResponseDtoList = new ArrayList<>();
            for(Url url: urlList) {
                UrlResponseDto urlResponseDto = new UrlResponseDto(url.getId(), url.getName(), url.getLongUrl(), url.getShortUrl(), url.getCustomUrl());
                urlResponseDtoList.add(urlResponseDto);
            }

            return new ResponseDto("Data fetched successfully!", urlResponseDtoList);
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), false);
        }
    }

    @Override
    public ResponseDto shortenUrl(UrlShortenRequest urlShortenRequest, HttpServletRequest request){
        System.out.println(urlShortenRequest.toString());
        try {
            User user = getUser(request);
            String longUrl = urlShortenRequest.longUrl();
            String name = urlShortenRequest.name();
            String shortUrl = SHORT_BASE_URL + getCrc32(longUrl);
            while(urlRepository.existsByShortUrl(shortUrl) || urlRepository.existsByCustomUrl(shortUrl)) {
                shortUrl += getCrc32(longUrl);
            }
            String customUrl = urlShortenRequest.customUrl();

            Optional<Url> optionalUrl = urlRepository.findByLongUrlAndUser(longUrl, user);
            if(optionalUrl.isPresent()) {
                Url url = optionalUrl.get();
                return new ResponseDto("Created successfully!", new UrlResponseDto(url.getId(), url.getName(), url.getLongUrl(), url.getShortUrl(), url.getCustomUrl()));
            } else {
                Url url = convertToUrlEntity(name, user, longUrl, shortUrl, customUrl);
                urlRepository.save(url);
                return new ResponseDto("Created successfully!", getUserUrlList(request));
            }
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), false);
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

            if(!customUrl.isEmpty() && (urlRepository.existsByCustomUrl(customUrl) || urlRepository.existsByShortUrl(customUrl))) {
                throw new DuplicateRequestException("This custom name is taken.");
            }
            Url updatedUrl = convertToUrlEntity(name, user, longUrl, shortUrl, customUrl);
            updatedUrl.setId(prevStoredUrl.getId());
            urlRepository.save(updatedUrl);

            return new ResponseDto("Updated successfully!", true);

        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), false);
        }
    }

    @Override
    public ResponseDto deleteUrl(Long id, HttpServletRequest request) {
        System.out.println(id);
        try {
            User user = getUser(request);
            if(!urlRepository.existsByIdAndUser(id, user)) throw new InvalidRequestStateException("Unauthorized request");
            urlRepository.deleteById(id);

            return new ResponseDto("Deleted successfully!", true);
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), false);
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
        byte[] bytes = url.getBytes(StandardCharsets.UTF_8);
        CRC32 crc32 = new CRC32();
        crc32.update(bytes, 0, bytes.length);

        return Long.toHexString(crc32.getValue());
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
