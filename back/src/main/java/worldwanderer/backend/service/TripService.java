package worldwanderer.backend.service;

import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;

import java.util.List;

public interface TripService {
    Trip createTrip(TripData tripRequest, User user);
    void deleteTrip(long id);
    TripData transformTripIntoTripData(Trip trip);
    Trip getTripForId(long id);
    List<Trip> getTripsForUser(User user);
    List<Trip> getHighestRatedTrips(int limit);
}
