package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

@RestController
@RequestMapping("/api/core/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TripService tripService;


}