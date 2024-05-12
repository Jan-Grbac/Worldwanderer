package worldwanderer.backend.service;

import worldwanderer.backend.entity.User;

public interface EncoderService {
    boolean checkPassword(User user, String password);
    String encode(String password);
}
