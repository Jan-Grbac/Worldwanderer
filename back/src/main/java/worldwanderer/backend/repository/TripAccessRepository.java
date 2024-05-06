package worldwanderer.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.TripAccess;
import worldwanderer.backend.entity.User;

import java.util.List;

@Repository
@Transactional
public interface TripAccessRepository extends JpaRepository<TripAccess, Long> {

    TripAccess findTripAccessByTripAndUser(Trip trip, User user);

    List<TripAccess> findTripAccessByTrip(Trip trip);

    List<TripAccess> findTripAccessByUser(User user);

    Long deleteByTripAndUser(Trip trip, User user);
}
