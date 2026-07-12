package com.rahul.finance_tracker.service;

import com.rahul.finance_tracker.dto.LoginRequest;
import com.rahul.finance_tracker.dto.LoginResponse;
import com.rahul.finance_tracker.dto.RegisterRequest;
import com.rahul.finance_tracker.entity.User;
import com.rahul.finance_tracker.repository.UserRepository;
import com.rahul.finance_tracker.security.JwtService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

    User user =
            userRepository.findByEmail(
                    request.getEmail()
            ).orElseThrow(
                    () -> new RuntimeException(
                            "User not found"
                    )
            );

    boolean matches =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );

    if (!matches) {
        throw new RuntimeException(
                "Invalid credentials"
        );
    }

    return new LoginResponse(
                user.getId(),
                jwtService.generateToken(
                        user.getEmail()
                )
        );
    }
}