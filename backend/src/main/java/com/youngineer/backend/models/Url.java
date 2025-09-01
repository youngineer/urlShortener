package com.youngineer.backend.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "url")
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @PrimaryKeyJoinColumn(name = "id")
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @Column(name = "long_url", nullable = false)
    private String longUrl;

    @Column(name = "short_url", nullable = false)
    private String shortUrl;

    @Column(name = "custom_url", unique = true)
    private String customUrl;

    public User getUser() {
        return user;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public String getCustomUrl() {
        return customUrl;
    }

    public void setCustomUrl(String customUrl) {
        this.customUrl = customUrl;
    }
}
