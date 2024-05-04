package worldwanderer.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name="tripAccess")
public class TripAccess {
    @Id
    private Long id;

    private User user;
    private Trip trip;

    public TripAccess() {

    }
}
