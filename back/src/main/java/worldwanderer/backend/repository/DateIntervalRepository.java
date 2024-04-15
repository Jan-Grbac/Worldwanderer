package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.Trip;

import java.util.List;

public interface DateIntervalRepository extends JpaRepository<DateInterval, Long> {

    List<DateInterval> findAllByTrip(Trip trip);
}
