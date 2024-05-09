package worldwanderer.backend.service;

import worldwanderer.backend.dto.DateIntervalData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.Trip;

import java.util.List;

public interface DateIntervalService {
    DateInterval createDateInterval(DateIntervalData dateIntervalData, Trip trip);
    void deleteDateInterval(long id);
    DateIntervalData transformDateIntervalIntoDateIntervalData(DateInterval dateInterval);
    DateInterval getDateIntervalForId(long id);
    List<DateInterval> getDateIntervalsForTrip(Trip trip);
    void updateDateInterval(DateIntervalData dateInterval);
}
