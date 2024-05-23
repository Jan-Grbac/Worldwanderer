package worldwanderer.backend.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import worldwanderer.backend.dto.UpdateUserInfoData;
import worldwanderer.backend.dto.UserData;
import worldwanderer.backend.entity.User;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();
    void store(User user);
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    UserData transformIntoUserData(User user);
    List<UserData> transformIntoUserData(List<User> users);
    void updateUser(User user, UpdateUserInfoData updateUserInfoData);
    List<User> getUsers();
    List<User> getUsersUsernameContainsString(String query);
}
