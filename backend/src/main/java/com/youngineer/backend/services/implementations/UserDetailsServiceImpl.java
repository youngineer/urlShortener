package com.youngineer.backend.services.implementations;

import com.youngineer.backend.models.User;
import com.youngineer.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmailId(username);
        if(userOptional.isEmpty()) throw new UsernameNotFoundException("User not found" + username);
        User user = userOptional.get();

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmailId())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();

    }
}
