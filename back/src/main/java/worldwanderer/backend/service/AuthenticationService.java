package worldwanderer.backend.service;

import worldwanderer.backend.dto.JWTAuthenticationResponse;
import worldwanderer.backend.dto.SignInRequest;
import worldwanderer.backend.dto.SignUpRequest;
import worldwanderer.backend.entity.User;

public interface AuthenticationService {

    User signUp(SignUpRequest signUpRequest);
    JWTAuthenticationResponse signIn(SignInRequest signInRequest);
}
