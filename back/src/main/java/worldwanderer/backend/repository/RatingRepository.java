package worldwanderer.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.Rating;
import worldwanderer.backend.entity.Trip;

import java.util.List;

@Repository
@Transactional
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findAllByTrip(Trip trip);
}
