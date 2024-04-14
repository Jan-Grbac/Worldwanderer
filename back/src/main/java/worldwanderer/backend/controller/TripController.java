package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/api/core/trip")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final UserService userService;

    @GetMapping("/getTrips/{username}")
    public ResponseEntity<List<TripData>> getTripsForUsername(@PathVariable String username) {
        List<Trip> trips = tripService.getTripsForUser(userService.getUserByUsername(username));
        List<TripData> tripDataList = new LinkedList<>();
        for(Trip trip: trips) {
            TripData tripData = TripData.builder()
                    .name(trip.getName())
                    .description(trip.getDescription())
                    .build();
            tripDataList.add(tripData);
        }
        return ResponseEntity.ok(tripDataList);
    }

    @PostMapping("/createTrip/{username}")
    public ResponseEntity<Trip> createTrip(@PathVariable String username, @RequestBody TripData tripData) {
        Trip trip = tripService.createTrip(tripData, userService.getUserByUsername(username));
        System.out.println("Created trip:" + trip.getName() + " " + trip.getDescription());
        return ResponseEntity.ok(trip);
    }
}
