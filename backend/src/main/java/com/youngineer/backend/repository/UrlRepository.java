package com.youngineer.backend.repository;

import com.youngineer.backend.models.Url;
import com.youngineer.backend.models.User;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<List<Url>> findAllByUser(User user, Sort sort, Limit limit);
    Optional<Url> findUrlByCustomUrl(String customUrl);
    Optional<Url> findUrlByShortUrl(String shortUrl);
}
