package worldwanderer.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.Trip;

import java.util.List;

@Repository
@Transactional
public interface DateIntervalRepository extends JpaRepository<DateInterval, Long> {

    List<DateInterval> findAllByTrip(Trip trip);
}
