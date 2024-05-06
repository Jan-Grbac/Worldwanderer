package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.TripAccess;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.TripAccessRepository;
import worldwanderer.backend.repository.TripRepository;
import worldwanderer.backend.repository.UserRepository;
import worldwanderer.backend.service.TripService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final TripAccessRepository tripAccessRepository;

    @Override
    public Trip createTrip(TripData tripRequest, User user) {
        Trip trip = Trip.builder()
                .name(tripRequest.getName())
                .description(tripRequest.getDescription())
                .rating(0)
                .user(user)
                .build();

        return tripRepository.save(trip);
    }

    @Override
    public void deleteTrip(long id) {
        tripRepository.deleteById(id);
    }

    @Override
    public TripData transformTripIntoTripData(Trip trip) {
        return TripData.builder()
                .name(trip.getName())
                .description(trip.getDescription())
                .rating(trip.getRating())
                .ownerUsername(trip.getUser().getUsername())
                .id(trip.getId())
                .build();
    }

    @Override
    public Trip getTripForId(long id) {
        return tripRepository.findById(id).orElse(null);
    }

    @Override
    public List<Trip> getTripsForUser(User user) {
        return tripRepository.findAllByUser(user);
    }

    @Override
    public List<Trip> getHighestRatedTrips(int limit) {
        Page<Trip> page = tripRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "rating")));
        return page.getContent();
    }

    @Override
    public boolean checkTripAccess(Trip trip, User user) {
        TripAccess tripAccess = tripAccessRepository.findTripAccessByTripAndUser(trip, user);
        return tripAccess != null;
    }

    @Override
    public List<User> getAllowedUsers(Trip trip) {
        List<TripAccess> permissions = tripAccessRepository.findTripAccessByTrip(trip);
        List<User> users = new ArrayList<>();
        for(TripAccess tripAccess : permissions) {
            users.add(tripAccess.getUser());
        }
        return users;
    }

    @Override
    public void giveTripAccess(Trip trip, User user) {
        TripAccess tripAccess = TripAccess.builder()
                .trip(trip)
                .user(user)
                .build();
        tripAccessRepository.save(tripAccess);
    }

    @Override
    public void revokeTripAccess(Trip trip, User user) {
        TripAccess tripAccess = TripAccess.builder()
                .trip(trip)
                .user(user)
                .build();
        tripAccessRepository.delete(tripAccess);
    }

    @Override
    public List<Trip> getSharedTripsForUser(User user) {
        List<TripAccess> allowedTrips = tripAccessRepository.findTripAccessByUser(user);
        List<Trip> sharedTrips = new ArrayList<>();
        for(TripAccess tripAccess : allowedTrips) {
            if(!tripAccess.getTrip().getUser().equals(user)) {
                sharedTrips.add(tripAccess.getTrip());
            }
        }
        return sharedTrips;
    }
}
