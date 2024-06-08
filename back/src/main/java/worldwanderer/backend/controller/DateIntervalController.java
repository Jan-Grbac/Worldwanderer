package worldwanderer.backend.controller;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import worldwanderer.backend.dto.DateIntervalData;
import worldwanderer.backend.entity.DateInterval;
import worldwanderer.backend.entity.Trip;
import worldwanderer.backend.service.DateIntervalService;
import worldwanderer.backend.service.TripService;

import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/api/core/dateInterval")
@RequiredArgsConstructor
public class DateIntervalController {

    private final TripService tripService;
    private final DateIntervalService dateIntervalService;

    @PostMapping("/createDateInterval/{tripId}")
    public ResponseEntity<DateIntervalData> createDateInterval(@PathVariable String tripId, @RequestBody DateIntervalData dateIntervalData) {
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        DateInterval dateInterval = dateIntervalService.createDateInterval(dateIntervalData, trip);
        return ResponseEntity.ok(dateIntervalService.transformDateIntervalIntoDateIntervalData(dateInterval));
    }

    @GetMapping("/getIntervals/{tripId}")
    public ResponseEntity<List<DateIntervalData>> getIntervalsForTripId(@PathVariable String tripId) {
        Trip trip = tripService.getTripForId(Long.parseLong(tripId));
        List<DateInterval> intervals = dateIntervalService.getDateIntervalsForTrip(trip);
        List<DateIntervalData> intervalsData = new LinkedList<>();
        for(DateInterval dateInterval : intervals) {
            intervalsData.add(
                    dateIntervalService.transformDateIntervalIntoDateIntervalData(dateInterval)
            );
        }
        return ResponseEntity.ok(intervalsData);
    }

    @DeleteMapping("/deleteDateInterval/{dateIntervalId}")
    public ResponseEntity<Void> deleteDateInterval(@PathVariable String dateIntervalId) {
        dateIntervalService.deleteDateInterval(Long.parseLong(dateIntervalId));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/updateDateInterval")
    public ResponseEntity<Void> updateDateInterval(@RequestBody DateIntervalData dateIntervalData) {
        dateIntervalService.updateDateInterval(dateIntervalData);
        return ResponseEntity.ok().build();
    }
}
