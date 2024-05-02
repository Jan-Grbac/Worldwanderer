package worldwanderer.backend.service;

import worldwanderer.backend.dto.TimeSlotData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;

import java.util.List;

public interface TimeSlotService {
    TimeSlot createDateInterval(TimeSlotData timeSlotData, DateInterval dateInterval);
    TimeSlotData transformTimeSlotIntoTimeSlotData(TimeSlot timeSlot);
    TimeSlot getTimeSlotForId(long id);
    TimeSlot updateTimeSlot(TimeSlot timeSlot);
    List<TimeSlot> getTimeSlotsForDateInterval(DateInterval dateInterval);
}
