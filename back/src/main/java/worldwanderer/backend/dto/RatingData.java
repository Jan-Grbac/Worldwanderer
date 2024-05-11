package worldwanderer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class RatingData {
    private Long id;
    private String username;
    private int grade;
    private String comment;
    private String ratingDate;
}
