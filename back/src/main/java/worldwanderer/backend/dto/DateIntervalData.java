package worldwanderer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.Date;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class DateIntervalData {
    private Long id;
    private Date startDate;
    private Date endDate;
    private String tripId;
}
