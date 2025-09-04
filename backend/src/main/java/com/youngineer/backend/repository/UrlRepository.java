package com.youngineer.backend.repository;

import com.youngineer.backend.models.Url;
import com.youngineer.backend.models.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    List<Url> findAllByUserOrderByCreatedAtDesc(User user);
    List<Url> findAllByUser(User user, Pageable pageable);
    Optional<Url> findByCustomUrl(String customUrl);
    Optional<Url> findByShortUrl(String shortUrl);
    Optional<Url> findByLongUrlAndUser(String longUrl, User user);
    boolean existsByCustomUrl(String customUrl);
    boolean existsByShortUrl(String shortUrl);
    void deleteById(Long id);
}
