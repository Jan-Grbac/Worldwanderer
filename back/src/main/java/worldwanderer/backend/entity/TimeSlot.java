package worldwanderer.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name="timeslot")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="interval_id")
    @JsonBackReference
    private DateInterval interval;

    private LocalTime startTime;
    private LocalTime endTime;

    public TimeSlot() {

    }
}
