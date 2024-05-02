package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;

import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findAllByInterval(DateInterval interval);
}
