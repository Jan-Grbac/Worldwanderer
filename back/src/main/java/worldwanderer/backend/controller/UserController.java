package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import worldwanderer.backend.service.UserService;

@RestController
@RequestMapping("/api/core/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
}