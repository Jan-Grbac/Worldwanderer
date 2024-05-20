package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.SerializationUtils;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Rating;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.TripAccess;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.TripAccessRepository;
import worldwanderer.backend.repository.TripRepository;
import worldwanderer.backend.service.TripService;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final TripAccessRepository tripAccessRepository;

    @Override
    public void store(Trip trip) {
        tripRepository.save(trip);
    }

    @Override
    public Trip createTrip(TripData tripRequest, User user) {
        Trip trip = Trip.builder()
                .name(tripRequest.getName())
                .description(tripRequest.getDescription())
                .rating(0)
                .published(false)
                .user(user)
                .country(tripRequest.getCountry())
                .build();

        return tripRepository.save(trip);
    }

    @Override
    public Trip createTripCopy(Trip trip, User user) {
        Trip newTrip = Trip.builder()
                .id(trip.getId())
                .user(user)
                .intervals(trip.getIntervals())
                .tripAccesses(new LinkedList<>())
                .name(trip.getName())
                .description(trip.getDescription())
                .rating(0)
                .published(false)
                .country(trip.getCountry())
                .build();
        Trip newTripCopy = SerializationUtils.clone(newTrip);
        return tripRepository.save(newTripCopy);
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
                .published(trip.isPublished())
                .publishedDate(trip.getPublishedDate())
                .country(trip.getCountry())
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
    public List<Trip> getActiveTripsForUser(User user) {
        List<Trip> allOwnedTrips = tripRepository.findAllByUser(user);
        List<Trip> activeTrips = new ArrayList<>();
        for(Trip trip : allOwnedTrips) {
            if(!trip.isPublished()) {
                activeTrips.add(trip);
            }
        }
        return activeTrips;
    }

    @Override
    public List<Trip> getHighestRatedTrips(int limit) {
        Page<Trip> page = tripRepository.findByPublishedTrueOrderByRatingDesc(PageRequest.of(0, limit));
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
        tripAccessRepository.deleteByTripAndUser(trip, user);
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

    @Override
    public void updateTrip(TripData trip) {
        Trip tripOld = tripRepository.getReferenceById(trip.getId());
        tripOld.setName(trip.getName());
        tripOld.setDescription(trip.getDescription());
        tripRepository.save(tripOld);
    }

    @Override
    public void publishTrip(long id) {
        Trip trip = tripRepository.getReferenceById(id);
        trip.setPublished(true);
        trip.setPublishedDate(new Date());
        tripRepository.save(trip);
    }

    @Override
    public List<Trip> getPublishedTripsForUser(User user) {
        List<Trip> allOwnedTrips = tripRepository.findAllByUser(user);
        List<Trip> publishedTrips = new ArrayList<>();
        for(Trip trip : allOwnedTrips) {
            if(trip.isPublished()) {
                publishedTrips.add(trip);
            }
        }
        return publishedTrips;
    }

    @Override
    public void updateTripRating(Trip trip) {
        float newAverage = (float) trip.getRatings().stream().mapToDouble(Rating::getGrade).average().orElse(0);
        trip.setRating(newAverage);
        tripRepository.save(trip);
    }
}
