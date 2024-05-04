package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;
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

    @PostMapping("/createTrip/{username}")
    public ResponseEntity<TripData> createTrip(@PathVariable String username, @RequestBody TripData tripData) {
        User user = userService.getUserByUsername(username);
        Trip trip = tripService.createTrip(tripData, user);
        return ResponseEntity.ok(tripService.transformTripIntoTripData(trip));
    }

    @GetMapping("/getTrips/{username}")
    public ResponseEntity<List<TripData>> getTripsForUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        List<Trip> trips = tripService.getTripsForUser(user);
        List<TripData> tripDataList = new LinkedList<>();
        for(Trip trip: trips) {
            TripData tripData = tripService.transformTripIntoTripData(trip);
            tripDataList.add(tripData);
        }
        return ResponseEntity.ok(tripDataList);
    }

    @GetMapping("/getTrip/{id}")
    public ResponseEntity<TripData> getTripForId(@PathVariable String id) {
        Trip trip = tripService.getTripForId(Long.parseLong(id));
        TripData tripData = tripService.transformTripIntoTripData(trip);
        return ResponseEntity.ok(tripData);
    }

    @DeleteMapping("/deleteTrip/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable String id) {
        tripService.deleteTrip(Long.parseLong(id));
        return ResponseEntity.ok().build();
    }
}
