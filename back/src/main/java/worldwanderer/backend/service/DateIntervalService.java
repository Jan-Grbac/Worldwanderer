package worldwanderer.backend.service;

import worldwanderer.backend.dto.DateIntervalData;
import worldwanderer.backend.dto.TripData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.Trip;

import java.util.List;

public interface DateIntervalService {
    DateInterval createDateInterval(DateIntervalData dateIntervalData, Trip trip);
    DateIntervalData transformDateIntervalIntoDateIntervalData(DateInterval dateInterval);
    DateInterval getDateIntervalForId(long id);
    List<DateInterval> getDateIntervalsForTrip(Trip trip);
}
