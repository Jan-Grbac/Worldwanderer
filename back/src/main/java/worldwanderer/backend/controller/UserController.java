package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.UpdateUserInfoData;
import worldwanderer.backend.dto.UserData;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.EncoderService;
import worldwanderer.backend.service.UserService;

@RestController
@RequestMapping("/api/core/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EncoderService encoderService;

    @GetMapping("/getUser/{username}")
    public ResponseEntity<UserData> getUser(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(userService.transformIntoUserData(user));
    }

    @PostMapping("/checkEmailCollision")
    public ResponseEntity<Boolean> checkEmailCollision(@RequestBody UserData userData) {
        User emailCollision = userService.getUserByEmail(userData.getEmail());
        if(emailCollision == null) {
            return ResponseEntity.ok(false);
        }
        else {
            return ResponseEntity.ok(true);
        }
    }

    @PostMapping("/checkUsernameCollision")
    public ResponseEntity<Boolean> checkUsernameCollision(@RequestBody UserData userData) {
        User usernameCollision = userService.getUserByUsername(userData.getUsername());
        if(usernameCollision == null) {
            return ResponseEntity.ok(false);
        }
        else {
            return ResponseEntity.ok(true);
        }
    }

    @PostMapping("/tryUpdate")
    public ResponseEntity<Boolean> tryUpdate(@RequestBody UpdateUserInfoData userData) {
        User user = userService.getUserByUsername(userData.getOldUsername());
        if(user == null || userData.getOldPassword().isEmpty()) {
            return ResponseEntity.ok(false);
        }
        if(!encoderService.checkPassword(user, userData.getOldPassword())) {
            return ResponseEntity.ok(false);
        }
        userService.updateUser(user, userData);
        return ResponseEntity.ok(true);
    }
}