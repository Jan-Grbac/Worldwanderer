package worldwanderer.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name="timeslot")
public class TimeSlot implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="interval_id")
    private DateInterval interval;

    private String name;
    private String notes;

    private LocalTime startTime;
    private LocalTime endTime;

    private Double lat;
    private Double lng;

    public TimeSlot() {

    }
}
