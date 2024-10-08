package worldwanderer.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;

import java.util.List;

@Repository
@Transactional
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findAllByUser(User user);
    List<Trip> findTripByNameContainsIgnoreCaseAndPublished(String query, boolean published);
    List<Trip> findTripByNameContainsIgnoreCaseAndPublishedAndCountriesContainsIgnoreCase(String query, boolean published, String country);
    Page<Trip> findByPublishedTrueOrderByRatingDesc(PageRequest pageRequest);
    List<Trip> findAllByUserAndNameContainsIgnoreCase(User user, String query);
}
