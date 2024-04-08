package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.CreateTripRequest;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

@RestController
@RequestMapping("/api/core/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TripService tripService;

    @PostMapping(value = "/createTrip", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Trip> createTrip(@RequestBody CreateTripRequest tripRequest) {
        return ResponseEntity.ok(tripService.createTrip(tripRequest));
    }
}