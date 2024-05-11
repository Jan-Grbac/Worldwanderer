package worldwanderer.backend.service;

import worldwanderer.backend.dto.RatingData;
import worldwanderer.backend.entity.Rating;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;

import java.util.List;

public interface RatingService {
    List<Rating> getRatingsForTrip(Trip trip);
    Rating getRatingForId(long id);
    Rating createRating(RatingData ratingData, User user, Trip trip);
    RatingData transformRatingIntoRatingData(Rating rating);
    void deleteRating(long id);
}
