package MenClass.demo.security;

import MenClass.demo.model.Utilizatori;
import MenClass.demo.payload.UserDetailsModificationRequest;
import MenClass.demo.payload.UserWithSelectedFieldsDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();

    List<UserWithSelectedFieldsDTO> getAllUsers();
    UserWithSelectedFieldsDTO getUser(String email);
    UserWithSelectedFieldsDTO getLoggedInUserDetails();
    UserWithSelectedFieldsDTO getUserById(Integer utilizatorId);
    void modifyUserDetails(String email, UserDetailsModificationRequest userDetailsModificationRequest);

    void deleteUser(String email);
    public void updateResetPasswordToken(String token, String email);
    public Utilizatori getByResetPasswordToken(String token);
    public void updatePassword(Utilizatori utilizator, String newPassword);
}
