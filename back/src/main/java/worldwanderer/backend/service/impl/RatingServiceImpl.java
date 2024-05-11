package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.RatingData;
import worldwanderer.backend.entity.Rating;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.repository.RatingRepository;
import worldwanderer.backend.service.RatingService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;

    @Override
    public List<Rating> getRatingsForTrip(Trip trip) {
        return ratingRepository.findAllByTrip(trip);
    }

    @Override
    public Rating createRating(RatingData ratingData, User user, Trip trip) {
        Rating rating = Rating.builder()
                .user(user)
                .trip(trip)
                .grade(ratingData.getGrade())
                .comment(ratingData.getComment())
                .ratingDate(new Date())
                .build();

        return ratingRepository.save(rating);
    }

    @Override
    public RatingData transformRatingIntoRatingData(Rating rating) {
        return RatingData.builder()
                .id(rating.getId())
                .grade(rating.getGrade())
                .ratingDate(rating.getRatingDate().toString())
                .comment(rating.getComment())
                .username(rating.getUser().getUsername())
                .build();
    }

    @Override
    public void deleteRating(long id) {
        ratingRepository.deleteById(id);
    }
}
