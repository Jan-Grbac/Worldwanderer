package worldwanderer.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void store(User user) {
        userRepository.save(user);
    }

    public List<User> getAllusers() {
        return userRepository.findAll();
    }
}
