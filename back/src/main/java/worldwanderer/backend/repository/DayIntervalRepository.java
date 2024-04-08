package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import worldwanderer.backend.entity.DayInterval;

public interface DayIntervalRepository extends JpaRepository<DayInterval, Long> {
}
