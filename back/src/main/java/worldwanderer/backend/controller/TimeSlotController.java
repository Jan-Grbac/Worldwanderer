package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.TimeSlotData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.TimeSlot;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.service.DateIntervalService;
import worldwanderer.backend.service.TimeSlotService;
import worldwanderer.backend.service.TripService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/core/timeslot")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TripService tripService;
    private final DateIntervalService dateIntervalService;
    private final TimeSlotService timeSlotService;

    @PostMapping("/createTimeslot/{dateIntervalId}")
    public ResponseEntity<TimeSlotData> createTimeSlot(@PathVariable Long dateIntervalId, @RequestBody TimeSlotData timeSlotData) {
        DateInterval dateInterval = dateIntervalService.getDateIntervalForId(dateIntervalId);
        TimeSlot timeSlot = timeSlotService.createTimeSlot(timeSlotData, dateInterval);
        return ResponseEntity.ok(timeSlotService.transformTimeSlotIntoTimeSlotData(timeSlot));
    }

    @GetMapping("/getTimeslotsForTrip/{tripId}")
    public ResponseEntity<List<List<TimeSlotData>>> getTimeSlotsForTrip(@PathVariable Long tripId) {
        Trip trip = tripService.getTripForId(tripId);
        List<DateInterval> dateIntervals = dateIntervalService.getDateIntervalsForTrip(trip);

        List<List<TimeSlotData>> timeSlotsForTrip = new ArrayList<>();

        for(DateInterval dateInterval : dateIntervals) {
            List<TimeSlot> timeSlots = timeSlotService.getTimeSlotsForDateInterval(dateInterval);
            List<TimeSlotData> timeSlotsData = new ArrayList<>();
            for(TimeSlot timeSlot : timeSlots) {
                timeSlotsData.add(timeSlotService.transformTimeSlotIntoTimeSlotData(timeSlot));
            }
            timeSlotsForTrip.add(timeSlotsData);
        }

        return ResponseEntity.ok(timeSlotsForTrip);
    }

    @GetMapping("/getTimeslots/{dateIntervalId}")
    public ResponseEntity<List<TimeSlotData>> getTimeSlots(@PathVariable Long dateIntervalId) {
        DateInterval dateInterval = dateIntervalService.getDateIntervalForId(dateIntervalId);
        List<TimeSlot> timeSlots = timeSlotService.getTimeSlotsForDateInterval(dateInterval);
        List<TimeSlotData> timeSlotsData = new ArrayList<>();
        for(TimeSlot timeSlot : timeSlots) {
            timeSlotsData.add(timeSlotService.transformTimeSlotIntoTimeSlotData(timeSlot));
        }
        return ResponseEntity.ok(timeSlotsData);
    }

    @PostMapping("/updateTimeslot/{timeSlotId}")
    public ResponseEntity<TimeSlotData> updateTimeSlot(@PathVariable Long timeSlotId, @RequestBody TimeSlotData timeSlotData) {
        TimeSlot timeSlot = timeSlotService.getTimeSlotForId(timeSlotId);

        timeSlot.setStartTime(timeSlotData.getStartTime());
        timeSlot.setEndTime(timeSlotData.getEndTime());

        timeSlotService.updateTimeSlot(timeSlot);
        return ResponseEntity.ok(timeSlotService.transformTimeSlotIntoTimeSlotData(timeSlot));
    }
}
