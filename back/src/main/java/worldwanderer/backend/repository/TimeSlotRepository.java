package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import worldwanderer.backend.entity.TimeSlot;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
}
