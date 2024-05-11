package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.RatingData;
import worldwanderer.backend.entity.Rating;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.RatingService;
import worldwanderer.backend.service.TripService;
import worldwanderer.backend.service.UserService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/core/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    private final TripService tripService;
    private final UserService userService;

    @GetMapping("/getRatingsForTrip/{tripId}")
    public ResponseEntity<List<RatingData>> getRatingsForTrip(@PathVariable("tripId") String tripId) {
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        List<Rating> ratings = ratingService.getRatingsForTrip(trip);
        List<RatingData> ratingDataList = new ArrayList<>();
        for (Rating rating : ratings) {
            ratingDataList.add(ratingService.transformRatingIntoRatingData(rating));
        }
        return ResponseEntity.ok(ratingDataList);
    }

    @PostMapping("/createRating/{tripId}")
    public ResponseEntity<RatingData> createRating(@PathVariable("tripId") String tripId, @RequestBody RatingData ratingData) {
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        User user = userService.getUserByUsername(ratingData.getUsername());
        Rating rating = ratingService.createRating(ratingData, user, trip);
        tripService.updateTripRating(trip, rating);
        return ResponseEntity.ok(ratingService.transformRatingIntoRatingData(rating));
    }

    @DeleteMapping("/deleteRating/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable("ratingId") String ratingId) {
        Rating rating = ratingService.getRatingForId(Long.parseLong(ratingId));
        Trip trip = rating.getTrip();
        rating.setGrade(-rating.getGrade());
        tripService.updateTripRating(trip, rating);
        ratingService.deleteRating(Long.parseLong(ratingId));
        return ResponseEntity.ok().build();
    }
}
