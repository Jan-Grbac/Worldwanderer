package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.UserData;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

@RestController
@RequestMapping("/api/core/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getUser/{username}")
    public ResponseEntity<UserData> getUser(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(userService.transformIntoUserData(user));
    }
}