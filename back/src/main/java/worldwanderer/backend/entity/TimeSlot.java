package worldwanderer.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.sql.Time;

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
    private DateInterval interval;

    private Time startTime;
    private Time endTime;

    public TimeSlot() {

    }
}
