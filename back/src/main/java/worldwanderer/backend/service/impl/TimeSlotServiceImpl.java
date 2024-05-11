package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.TimeSlotData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;
import worldwanderer.backend.repository.TimeSlotRepository;
import worldwanderer.backend.service.TimeSlotService;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public TimeSlot createTimeSlot(TimeSlotData timeSlotData, DateInterval dateInterval) {

        LocalTime startTime = null, endTime = null;
        if(timeSlotData.getStartTime() != null && !timeSlotData.getStartTime().isEmpty())
            startTime = LocalTime.parse(timeSlotData.getStartTime());
        if(timeSlotData.getEndTime() != null && !timeSlotData.getEndTime().isEmpty())
            endTime = LocalTime.parse(timeSlotData.getEndTime());

        TimeSlot timeSlot = TimeSlot
                .builder()
                .name(timeSlotData.getName())
                .notes(timeSlotData.getNotes())
                .startTime(startTime)
                .endTime(endTime)
                .lat(timeSlotData.getLat())
                .lng(timeSlotData.getLng())
                .interval(dateInterval).build();

        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public TimeSlotData transformTimeSlotIntoTimeSlotData(TimeSlot timeSlot) {
        return TimeSlotData.builder()
                .name(timeSlot.getName())
                .notes(timeSlot.getNotes())
                .startTime(timeSlot.getStartTime() != null ? timeSlot.getStartTime().toString() : null)
                .endTime(timeSlot.getEndTime() != null ? timeSlot.getEndTime().toString() : null)
                .lat(timeSlot.getLat())
                .lng(timeSlot.getLng())
                .id(timeSlot.getId())
                .dateIntervalId(timeSlot.getInterval().getId().toString())
                .build();
    }

    @Override
    public TimeSlot getTimeSlotForId(long id) {
        return timeSlotRepository.findById(id).orElse(null);
    }

    @Override
    public TimeSlot updateTimeSlot(TimeSlot timeSlot) {
        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public void deleteTimeSlot(long id) {
        timeSlotRepository.deleteById(id);
    }

    @Override
    public List<TimeSlot> getTimeSlotsForDateInterval(DateInterval dateInterval) {
        return timeSlotRepository.findAllByInterval(dateInterval);
    }
}