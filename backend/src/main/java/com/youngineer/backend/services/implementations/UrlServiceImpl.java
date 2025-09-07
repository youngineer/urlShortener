package com.youngineer.backend.services.implementations;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
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

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
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
                UrlResponseDto urlResponseDto = new UrlResponseDto(url.getId(), url.getName(), url.getLongUrl(), url.getShortUrl(), url.getCustomUrl(), url.getQrCode());
                urlResponseDtoList.add(urlResponseDto);
            }

            return new ResponseDto("Data fetched successfully!", urlResponseDtoList);
        } catch (Exception e) {
            return new ResponseDto(e.getMessage(), null);
        }
    }

    @Override
    public ResponseDto shortenUrl(UrlShortenRequest urlShortenRequest, HttpServletRequest request) {
        try {
            User user = getUser(request);
            String longUrl = urlShortenRequest.longUrl();
            String name = urlShortenRequest.name();
            String shortUrl = SHORT_BASE_URL + getCrc32(longUrl);

            int attempt = 0;
            while(urlRepository.existsByShortUrl(shortUrl) || urlRepository.existsByCustomUrl(shortUrl)) {
                attempt++;
                shortUrl = SHORT_BASE_URL + getCrc32(longUrl) + "_" + attempt;
            }

            String customUrl = urlShortenRequest.customUrl();
            String qrCodeBase64 = generateQRCodeBase64(longUrl);

            Optional<Url> optionalUrl = urlRepository.findByLongUrlAndUser(longUrl, user);
            if (optionalUrl.isPresent()) {
                Url url = optionalUrl.get();
                return new ResponseDto("URL already exists!", new UrlResponseDto(url.getId(), url.getName(), url.getLongUrl(), url.getShortUrl(), url.getCustomUrl(), url.getQrCode()));
            } else {
                Url url = convertToUrlEntity(name, user, longUrl, shortUrl, customUrl);
                url.setQrCode(qrCodeBase64);
                urlRepository.save(url);

                return new ResponseDto("Created successfully!", true);
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

    private String generateQRCodeBase64(String url) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 300, 300);
            BufferedImage bufferedImage = new BufferedImage(300, 300, BufferedImage.TYPE_INT_RGB);

            for (int x = 0; x < 300; x++) {
                for (int y = 0; y < 300; y++) {
                    bufferedImage.setRGB(x, y, (bitMatrix.get(x, y)) ? 0x000000 : 0xFFFFFF);
                }
            }

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "PNG", byteArrayOutputStream);

            return Base64.getEncoder().encodeToString(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating QR code", e);
        }
    }
}
