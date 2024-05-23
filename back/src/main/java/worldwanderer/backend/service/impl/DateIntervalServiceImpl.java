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
                .name(dateIntervalData.getName())
                .budget(dateIntervalData.getBudget())
                .build();
        List<DateInterval> allIntervals = getDateIntervalsForTrip(dateInterval.getTrip());
        if(allIntervals.isEmpty()) {
            dateInterval.setPos(0);
        }
        else {
            dateInterval.setPos(allIntervals.getLast().getPos() + 1);
        }

        return dateIntervalRepository.save(dateInterval);
    }

    @Override
    public void deleteDateInterval(long id) {
        DateInterval dateInterval = getDateIntervalForId(id);
        List<DateInterval> allIntervals = getDateIntervalsForTrip(dateInterval.getTrip());

        boolean moveBack = false;
        for(DateInterval interval: allIntervals) {
            if(moveBack) {
                interval.setPos(interval.getPos() - 1);
                dateIntervalRepository.save(interval);
            }
            if(interval.equals(dateInterval)) {
                moveBack = true;
            }
        }

        dateIntervalRepository.delete(dateInterval);
    }

    @Override
    public DateIntervalData transformDateIntervalIntoDateIntervalData(DateInterval dateInterval) {
        return DateIntervalData.builder()
                .startDate(dateInterval.getStartDate())
                .endDate(dateInterval.getEndDate())
                .name(dateInterval.getName())
                .budget(dateInterval.getBudget())
                .id(dateInterval.getId())
                .tripId(dateInterval.getTrip().getId().toString())
                .pos(dateInterval.getPos())
                .build();
    }

    @Override
    public DateInterval getDateIntervalForId(long id) {
        return dateIntervalRepository.findById(id).orElse(null);
    }

    @Override
    public List<DateInterval> getDateIntervalsForTrip(Trip trip) {
        return dateIntervalRepository.findAllByTripOrderByPosAsc(trip);
    }

    @Override
    public void updateDateInterval(DateIntervalData dateInterval) {
        DateInterval dateIntervalOld = dateIntervalRepository.getReferenceById(dateInterval.getId());
        dateIntervalOld.setStartDate(dateInterval.getStartDate());
        dateIntervalOld.setEndDate(dateInterval.getEndDate());
        dateIntervalOld.setName(dateInterval.getName());
        dateIntervalOld.setBudget(dateInterval.getBudget());
        dateIntervalRepository.save(dateIntervalOld);
    }
}
