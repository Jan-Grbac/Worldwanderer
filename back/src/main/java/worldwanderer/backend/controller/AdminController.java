package worldwanderer.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.AdminPanelSearchQuery;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.dto.UserData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final TripService tripService;

    @PostMapping("/getUsersAndTrips")
    public ResponseEntity<String> getUsersAndTrips(@RequestBody AdminPanelSearchQuery query) {
        Map<String, List<TripData>> map = new HashMap<>();

        String username = query.getUsername();
        String tripName = query.getTripName();

        List<User> users;
        if(username.isEmpty()) {
            users = userService.getUsers();
        }
        else {
            users = userService.getUsersUsernameContainsString(username);
        }

        users.sort(Comparator.comparing(User::getUsername));

        for (User user : users) {
            List<Trip> trips;
            if(tripName.isEmpty()) {
                trips = tripService.getTripsForUser(user);
            }
            else {
                trips = tripService.getTripsForUserContainingQuery(user, tripName);
            }

            List<TripData> tripData = tripService.transformTripIntoTripData(trips);

            if(!tripData.isEmpty()) {
                map.put(user.getUsername(), tripData);
            }
        }

        ObjectMapper mapper = new ObjectMapper();
        String json = "";
        try {
            json = mapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(json);
    }
}
