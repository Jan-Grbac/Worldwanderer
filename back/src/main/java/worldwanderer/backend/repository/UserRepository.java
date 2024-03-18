package worldwanderer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import worldwanderer.backend.entity.Role;
import worldwanderer.backend.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @Override
    Optional<User> findById(Long id);

    Optional<User> findByRole(Role role);
}
