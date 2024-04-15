package worldwanderer.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name="interval")
public class DateInterval {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="trip_id")
    private Trip trip;

    @OneToMany(mappedBy = "interval", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<TimeSlot> timeslots;

    private Date startDate;
    private Date endDate;

    public DateInterval() {

    }
}
