package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.JWTAuthenticationResponse;
import worldwanderer.backend.dto.JWTValidationResponse;
import worldwanderer.backend.dto.SignInRequest;
import worldwanderer.backend.dto.SignUpRequest;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.AuthenticationService;
import worldwanderer.backend.service.JWTService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JWTService jwtService;

    @PostMapping(value="/signup", consumes = "application/json", produces = "application/json")
    public ResponseEntity<JWTAuthenticationResponse> signUp(@RequestBody SignUpRequest signUpRequest) {
        authenticationService.signUp(signUpRequest);
        return ResponseEntity.ok(authenticationService.signIn(
                SignInRequest.builder()
                        .username(signUpRequest.getUsername())
                        .password(signUpRequest.getPassword())
                        .build()));
    }

    @PostMapping(value="/signin", consumes = "application/json", produces = "application/json")
    public ResponseEntity<JWTAuthenticationResponse> signIn(@RequestBody SignInRequest signInRequest) {
        return ResponseEntity.ok(authenticationService.signIn(signInRequest));
    }

    @GetMapping(value="/validate", consumes = "application/json", produces = "application/json")
    public ResponseEntity<JWTValidationResponse> validateToken(@RequestParam String token) {
        boolean tokenExpired = jwtService.isTokenExpired(token);
        return ResponseEntity.ok(JWTValidationResponse.builder()
                .valid(String.valueOf(!tokenExpired))
                .build());
    }
}
