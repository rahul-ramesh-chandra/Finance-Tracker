package com.rahul.finance_tracker.controller;

import com.rahul.finance_tracker.dto.AuthResponse;
import com.rahul.finance_tracker.dto.LoginRequest;
import com.rahul.finance_tracker.dto.LoginResponse;
import com.rahul.finance_tracker.dto.RegisterRequest;
import com.rahul.finance_tracker.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {

        userService.register(request);

        return new AuthResponse("User registered successfully");
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {
        return userService.login(request);
    }
}