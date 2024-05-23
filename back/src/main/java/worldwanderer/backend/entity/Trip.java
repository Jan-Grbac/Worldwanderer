package worldwanderer.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.hibernate.internal.util.collections.Stack;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name="trip")
public class Trip implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DateInterval> intervals;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripAccess> tripAccesses;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings;

    private String name;
    private String description;

    private float rating;
    private boolean published;
    private Date publishedDate;

    private String countries;

    public Trip() {

    }
}
