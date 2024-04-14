package worldwanderer.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.UserRepository;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();

    void store(User user);
    User getUserByUsername(String username);
}
