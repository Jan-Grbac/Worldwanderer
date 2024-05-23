package worldwanderer.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name="interval")
public class DateInterval implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="trip_id")
    private Trip trip;

    @OneToMany(mappedBy = "interval", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeSlot> timeslots;

    private Date startDate;
    private Date endDate;

    private String name;
    private float budget;

    private int pos;

    public DateInterval() {

    }
}
