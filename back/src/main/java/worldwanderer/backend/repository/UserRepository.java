package worldwanderer.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.Role;
import worldwanderer.backend.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByRole(Role role);

    List<User> findAllByRole(Role role);

    List<User> findAllByUsernameContainsIgnoreCase(String query);
}
