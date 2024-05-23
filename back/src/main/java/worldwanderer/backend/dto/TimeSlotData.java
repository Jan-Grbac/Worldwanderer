package worldwanderer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class TimeSlotData {
    private Long id;
    private String name;
    private String notes;
    private String startTime;
    private String endTime;
    private Double lat;
    private Double lng;
    private String dateIntervalId;
    private int pos;
}
