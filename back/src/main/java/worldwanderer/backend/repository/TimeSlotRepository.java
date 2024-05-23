package worldwanderer.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;

import java.util.List;

@Repository
@Transactional
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findAllByIntervalOrderByPosAsc(DateInterval interval);
}
