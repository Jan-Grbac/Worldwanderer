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
            TripData tripData = transformIntoTripData(trip);
            tripDataList.add(tripData);
        }
        return ResponseEntity.ok(tripDataList);
    }

    @GetMapping("/getTrip/{id}")
    public ResponseEntity<TripData> getTripForId(@PathVariable String id) {
        Trip trip = tripService.getTripForId(Long.parseLong(id));
        TripData tripData = transformIntoTripData(trip);
        return ResponseEntity.ok(tripData);
    }

    @PostMapping("/createTrip/{username}")
    public ResponseEntity<TripData> createTrip(@PathVariable String username, @RequestBody TripData tripData) {
        Trip trip = tripService.createTrip(tripData, userService.getUserByUsername(username));
        System.out.println("Created trip:" + trip.getName() + " " + trip.getDescription());
        return ResponseEntity.ok(transformIntoTripData(trip));
    }

    private TripData transformIntoTripData(Trip trip) {
        return TripData.builder()
                .name(trip.getName())
                .description(trip.getDescription())
                .id(trip.getId())
                .build();
    }
}
