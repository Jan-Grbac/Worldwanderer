package worldwanderer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class TripData {
    private Long id;
    private String name;
    private String description;
    private String ownerUsername;
    private float rating;
    private boolean published;
    private Date publishedDate;
    private List<String> countries;
}
