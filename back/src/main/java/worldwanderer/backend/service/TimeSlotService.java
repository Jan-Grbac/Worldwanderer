package worldwanderer.backend.service;

import worldwanderer.backend.dto.TimeSlotData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;

import java.util.List;

public interface TimeSlotService {
    TimeSlot createTimeSlot(TimeSlotData timeSlotData, DateInterval dateInterval);
    TimeSlotData transformTimeSlotIntoTimeSlotData(TimeSlot timeSlot);
    TimeSlot getTimeSlotForId(long id);
    void updateTimeSlot(TimeSlotData timeSlot);
    void updateTimeSlotPosition(TimeSlotData timeSlotData);
    void deleteTimeSlot(long id);
    List<TimeSlot> getTimeSlotsForDateInterval(DateInterval dateInterval);
}
