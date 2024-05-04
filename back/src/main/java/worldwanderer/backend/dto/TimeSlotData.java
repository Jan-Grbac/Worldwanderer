package worldwanderer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.sql.Time;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class TimeSlotData {
    private Long id;
    private String startTime;
    private String endTime;
}
