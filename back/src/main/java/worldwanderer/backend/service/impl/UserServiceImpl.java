package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.UpdateUserInfoData;
import worldwanderer.backend.dto.UserData;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.UserRepository;
import worldwanderer.backend.service.EncoderService;
import worldwanderer.backend.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EncoderService encoderService;

    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public void store(User user) {
        userRepository.save(user);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserData transformIntoUserData(User user) {
        return UserData.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public void updateUser(User user, UpdateUserInfoData userData) {
        if(!userData.getEmail().isEmpty()) {
            user.setEmail(userData.getEmail());
        }
        if(!userData.getUsername().isEmpty()) {
            user.setUsername(userData.getUsername());
        }
        if(!userData.getNewPassword().isEmpty()) {
            user.setPassword(encoderService.encode(userData.getNewPassword()));
        }
        userRepository.save(user);
    }
}
