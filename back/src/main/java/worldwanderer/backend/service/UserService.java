package worldwanderer.backend.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import worldwanderer.backend.dto.UserData;
import worldwanderer.backend.entity.User;

public interface UserService {
    UserDetailsService userDetailsService();
    void store(User user);
    User getUserByUsername(String username);
    UserData transformIntoUserData(User user);
}
