package worldwanderer.backend;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    private String password;

    protected User() {};

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

}
