package worldwanderer.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import worldwanderer.backend.entity.User;
import worldwanderer.backend.service.EncoderService;

@Service
@RequiredArgsConstructor
public class EncoderServiceImpl implements EncoderService {

    private final PasswordEncoder encoder;

    @Override
    public boolean checkPassword(User user, String password) {
        return encoder.matches(password, user.getPassword());
    }

    @Override
    public String encode(String password) {
        return encoder.encode(password);
    }
}
