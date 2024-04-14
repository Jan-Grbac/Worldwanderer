package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
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
                .user(user)
                .build();

        return tripRepository.save(trip);
    }

    @Override
    public Trip getTripForId(long id) {
        return tripRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Trip> getTripsForUser(User user) {
        return tripRepository.findAllByUser(user);
    }
}
