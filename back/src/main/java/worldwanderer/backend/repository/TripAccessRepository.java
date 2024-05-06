package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.TripAccess;
import worldwanderer.backend.entity.User;

import java.util.List;

public interface TripAccessRepository extends JpaRepository<TripAccess, Long> {

    TripAccess findTripAccessByTripAndUser(Trip trip, User user);

    List<TripAccess> findTripAccessByTrip(Trip trip);

    List<TripAccess> findTripAccessByUser(User user);

}
