package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import worldwanderer.backend.dto.TimeSlotData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;
import worldwanderer.backend.repository.TimeSlotRepository;
import worldwanderer.backend.service.TimeSlotService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public TimeSlot createTimeSlot(TimeSlotData timeSlotData, DateInterval dateInterval) {
        TimeSlot timeSlot = TimeSlot
                .builder()
                .startTime(timeSlotData.getStartTime())
                .endTime(timeSlotData.getEndTime())
                .interval(dateInterval).build();

        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public TimeSlotData transformTimeSlotIntoTimeSlotData(TimeSlot timeSlot) {
        return TimeSlotData.builder()
                .startTime(timeSlot.getStartTime())
                .endTime(timeSlot.getEndTime())
                .id(timeSlot.getId())
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
    public List<TimeSlot> getTimeSlotsForDateInterval(DateInterval dateInterval) {
        return timeSlotRepository.findAllByInterval(dateInterval);
    }
}