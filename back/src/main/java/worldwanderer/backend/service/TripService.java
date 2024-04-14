package worldwanderer.backend.service;

import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;

import java.util.List;

public interface TripService {
    Trip createTrip(TripData tripRequest, User user);
    List<Trip> getTripsForUser(User user);
}
