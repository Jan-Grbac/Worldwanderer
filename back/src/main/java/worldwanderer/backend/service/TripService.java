package worldwanderer.backend.service;

import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Rating;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;

import java.util.List;

public interface TripService {
    Trip createTrip(TripData tripRequest, User user);
    Trip createTripCopy(Trip trip, User user);
    void deleteTrip(long id);
    TripData transformTripIntoTripData(Trip trip);
    Trip getTripForId(long id);
    List<Trip> getTripsForUser(User user);
    List<Trip> getActiveTripsForUser(User user);
    List<Trip> getHighestRatedTrips(int limit);
    boolean checkTripAccess(Trip trip, User user);
    List<User> getAllowedUsers(Trip trip);
    void giveTripAccess(Trip trip, User user);
    void revokeTripAccess(Trip trip, User user);
    List<Trip> getSharedTripsForUser(User user);
    void updateTrip(TripData trip);
    void publishTrip(long id);
    List<Trip> getPublishedTripsForUser(User user);
    void updateTripRating(Trip trip, Rating rating);
}
