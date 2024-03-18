package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.JWTAuthenticationResponse;
import worldwanderer.backend.dto.SignInRequest;
import worldwanderer.backend.dto.SignUpRequest;
import worldwanderer.backend.entity.Role;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.UserRepository;
import worldwanderer.backend.service.AuthenticationService;
import worldwanderer.backend.service.JWTService;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    public User signUp(SignUpRequest signUpRequest) {
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .username(signUpRequest.getUsername())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    public JWTAuthenticationResponse signIn(SignInRequest signInRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));

        User user = userRepository.findByUsername(signInRequest.getUsername()).orElseThrow(() -> new IllegalArgumentException("Username or password is incorrect."));
        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);
        return JWTAuthenticationResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .build();
    }
}
