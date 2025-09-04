package com.youngineer.backend.repository;

import com.youngineer.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailId(String emailId);
    Boolean existsByEmailId(String emailId);
}
