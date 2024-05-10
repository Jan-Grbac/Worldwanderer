package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

import java.util.ArrayList;
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
        tripService.giveTripAccess(trip, user);
        return ResponseEntity.ok(tripService.transformTripIntoTripData(trip));
    }

    @PostMapping("/createTripCopy/{tripId}/{username}")
    public ResponseEntity<TripData> createTripCopy(@PathVariable String tripId, @PathVariable String username) {
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        User user = userService.getUserByUsername(username);
        Trip tripCopy = tripService.createTripCopy(trip, user);
        tripService.giveTripAccess(tripCopy, user);
        return ResponseEntity.ok(tripService.transformTripIntoTripData(tripCopy));
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

    @GetMapping("/getSharedTrips/{username}")
    public ResponseEntity<List<TripData>> getSharedTripsForUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        List<Trip> trips = tripService.getSharedTripsForUser(user);
        List<TripData> tripDataList = new LinkedList<>();
        for(Trip trip: trips) {
            tripDataList.add(tripService.transformTripIntoTripData(trip));
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

    @GetMapping("/getAllowedUsers/{tripId}")
    public ResponseEntity<List<User>> getAllowedUsers(@PathVariable String tripId) {
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        List<User> allowedUsers = tripService.getAllowedUsers(trip);
        return ResponseEntity.ok(allowedUsers);
    }

    @PostMapping("/checkTripAccess/{username}/{tripId}")
    public ResponseEntity<Void> checkTripAccess(@PathVariable String username, @PathVariable String tripId) {
        User user = userService.getUserByUsername(username);
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        if(tripService.checkTripAccess(trip, user)) {
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).build();
        }
    }

    @PostMapping("/giveTripAccess/{username}/{tripId}")
    public ResponseEntity<Void> giveTripAccess(@PathVariable String username, @PathVariable String tripId) {
        User user = userService.getUserByUsername(username);
        if(user == null) {
            return ResponseEntity.badRequest().build();
        }
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        tripService.giveTripAccess(trip, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/revokeTripAccess/{username}/{tripId}")
    public ResponseEntity<Void> revokeTripAccess(@PathVariable String username, @PathVariable String tripId) {
        User user = userService.getUserByUsername(username);
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        tripService.revokeTripAccess(trip, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getHighestRatedTrips")
    public ResponseEntity<List<TripData>> getHighestRatedTrips() {
        List<Trip> trips = tripService.getHighestRatedTrips(5);
        List<TripData> tripDataList = new LinkedList<>();
        for(Trip trip : trips) {
            tripDataList.add(tripService.transformTripIntoTripData(trip));
        }
        return ResponseEntity.ok(tripDataList);
    }

    @PostMapping("/updateTrip")
    public ResponseEntity<Void> updateTrip(@RequestBody TripData tripData) {
        tripService.updateTrip(tripData);
        return ResponseEntity.ok().build();
    }
}