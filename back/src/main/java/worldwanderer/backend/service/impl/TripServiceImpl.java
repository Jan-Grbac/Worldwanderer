package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.CreateTripRequest;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.repository.TripRepository;
import worldwanderer.backend.service.TripService;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    @Override
    public Trip createTrip(CreateTripRequest tripRequest) {
        Trip trip = Trip.builder()
                .name(tripRequest.getName())
                .description(tripRequest.getDescription())
                .build();

        return tripRepository.save(trip);
    }
}
