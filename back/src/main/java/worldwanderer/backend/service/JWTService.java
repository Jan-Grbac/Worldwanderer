package worldwanderer.backend.service;

import org.springframework.security.core.userdetails.UserDetails;
import worldwanderer.backend.entity.User;

import java.util.HashMap;

public interface JWTService {

    String extractUsername(String token);

    String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);

    String generateRefreshToken(HashMap<String, Object> extraClaims, UserDetails userDetails);
}
