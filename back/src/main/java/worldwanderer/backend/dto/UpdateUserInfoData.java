package worldwanderer.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class UpdateUserInfoData {
    private String email;
    private String oldUsername;
    private String username;
    private String newPassword;
    private String oldPassword;
}
