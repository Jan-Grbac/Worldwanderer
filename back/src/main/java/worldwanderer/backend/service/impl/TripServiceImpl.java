package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.TripRepository;
import worldwanderer.backend.service.TripService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

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
}
