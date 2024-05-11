package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.DateIntervalData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.repository.DateIntervalRepository;
import worldwanderer.backend.service.DateIntervalService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DateIntervalServiceImpl implements DateIntervalService {

    private final DateIntervalRepository dateIntervalRepository;

    @Override
    public DateInterval createDateInterval(DateIntervalData dateIntervalData, Trip trip) {
        DateInterval dateInterval = DateInterval.builder()
                .startDate(dateIntervalData.getStartDate())
                .endDate(dateIntervalData.getEndDate())
                .trip(trip)
                .build();

        return dateIntervalRepository.save(dateInterval);
    }

    @Override
    public void deleteDateInterval(long id) {
        dateIntervalRepository.deleteById(id);
    }

    @Override
    public DateIntervalData transformDateIntervalIntoDateIntervalData(DateInterval dateInterval) {
        return DateIntervalData.builder()
                .startDate(dateInterval.getStartDate())
                .endDate(dateInterval.getEndDate())
                .id(dateInterval.getId())
                .tripId(dateInterval.getTrip().getId().toString())
                .build();
    }

    @Override
    public DateInterval getDateIntervalForId(long id) {
        return dateIntervalRepository.findById(id).orElse(null);
    }

    @Override
    public List<DateInterval> getDateIntervalsForTrip(Trip trip) {
        return dateIntervalRepository.findAllByTrip(trip);
    }

    @Override
    public void updateDateInterval(DateIntervalData dateInterval) {
        DateInterval dateIntervalOld = dateIntervalRepository.getReferenceById(dateInterval.getId());
        dateIntervalOld.setStartDate(dateInterval.getStartDate());
        dateIntervalOld.setEndDate(dateInterval.getEndDate());
        dateIntervalRepository.save(dateIntervalOld);
    }
}
