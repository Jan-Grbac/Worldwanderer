package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import worldwanderer.backend.entity.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
