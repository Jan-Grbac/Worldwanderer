package worldwanderer.backend.service;

import worldwanderer.backend.dto.CreateTripRequest;
import worldwanderer.backend.entity.Trip;

public interface TripService {
    Trip createTrip(CreateTripRequest tripRequest);
}
