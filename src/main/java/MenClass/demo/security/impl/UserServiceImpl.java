package MenClass.demo.security.impl;

import MenClass.demo.model.Utilizatori;
import MenClass.demo.payload.UserDetailsModificationRequest;
import MenClass.demo.payload.UserWithSelectedFieldsDTO;
import MenClass.demo.repository.UserRepository;
import MenClass.demo.security.UserService;
import MenClass.demo.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService, UserService {
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Utilizatorul cu e-mail nu a fost găsit: " + email));
    }

    @Override
    public UserDetailsService userDetailsService() {
        return this;
    }

    @Override
    public List<UserWithSelectedFieldsDTO> getAllUsers() {
        return userRepository.findAllUsers();
    }

    @Override
    public UserWithSelectedFieldsDTO getUser(String email) {
        Optional<Utilizatori> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            Utilizatori user = optionalUser.get();
            return new UserWithSelectedFieldsDTO(user.getUtilizatorId(), email, user.getTelefon(), user.getNume(), user.getPrenume(), user.getRol(), user.getPoza());
        }
        return null;
    }

    @Override
    public UserWithSelectedFieldsDTO getLoggedInUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String loggedinEmail = authentication.getName();
            Optional<Utilizatori> optionalUser = userRepository.findByEmail(loggedinEmail);

            if (optionalUser.isPresent()) {
                Utilizatori user = optionalUser.get();
                return new UserWithSelectedFieldsDTO(user.getUtilizatorId(), loggedinEmail, user.getTelefon(), user.getNume(), user.getPrenume(), user.getRol(), user.getPoza());
            }
        }
        return null;
    }

    @Override
    public void modifyUserDetails(String email, UserDetailsModificationRequest userDetailsModificationRequest) {
        Optional<Utilizatori> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            Utilizatori user = optionalUser.get();
            if (userDetailsModificationRequest.getEmail() != null) {
                user.setEmail(userDetailsModificationRequest.getEmail());
            }
            if (userDetailsModificationRequest.getTelefon() != null) {
                user.setTelefon(userDetailsModificationRequest.getTelefon());
            }
            if (userDetailsModificationRequest.getNume() != null) {
                user.setNume(userDetailsModificationRequest.getNume());
            }
            if (userDetailsModificationRequest.getPrenume() != null) {
                user.setPrenume(userDetailsModificationRequest.getPrenume());
            }
            if (userDetailsModificationRequest.getPassword() != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String encodedPassword = passwordEncoder.encode(userDetailsModificationRequest.getPassword());
                user.setParola(encodedPassword);
            }
            if (userDetailsModificationRequest.getRol() != null) {
                user.setRol(userDetailsModificationRequest.getRol());
                if (Objects.equals(userDetailsModificationRequest.getRol(), "ROLE_ANGAJAT")) {
                    String sql = "SELECT COUNT(*) FROM angajati WHERE utilizator_id = ?";
                    Integer count = jdbcTemplate.queryForObject(sql, new Object[]{user.getUtilizatorId()}, Integer.class);
                    if (count == 0) {
                        sql = "INSERT INTO angajati(poza, utilizator_id) VALUES (?, ?)";
                        jdbcTemplate.update(sql, user.getPoza(), user.getUtilizatorId());
                    }
                }
            }
            if (userDetailsModificationRequest.getPoza() != null) {
                try {
                    user.setPoza(Utils.decodeBase64(userDetailsModificationRequest.getPoza())); // asigură-te că getPoza() returnează un String
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Șir Base64 nevalid pentru 'poza'");
                }
            }
            userRepository.save(user);
        }
    }

    @Override
    @Transactional
    public void deleteUser(String email) {
        Optional<Utilizatori> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            userRepository.deleteUserByUsername(email);
        }
    }

    public void updateResetPasswordToken(String token, String email) {
        Optional<Utilizatori> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            Utilizatori utilizator = optionalUser.get();
            utilizator.setResetPasswordToken(token);
            userRepository.save(utilizator);
        }
    }

    @Override
    public UserWithSelectedFieldsDTO getUserById(Integer utilizatorId) {
        Optional<Utilizatori> optionalUser = userRepository.findById(utilizatorId);
        if (optionalUser.isPresent()) {
            Utilizatori user = optionalUser.get();
            return new UserWithSelectedFieldsDTO(user.getUtilizatorId(), user.getEmail(), user.getTelefon(), user.getNume(), user.getPrenume(), user.getRol(), user.getPoza());
        }
        return null;
    }

    public Utilizatori getByResetPasswordToken(String token) {
        return userRepository.findByResetPasswordToken(token);
    }

    public void updatePassword(Utilizatori utilizator, String newPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(newPassword);
        utilizator.setParola(encodedPassword);
        utilizator.setResetPasswordToken(null);
        userRepository.save(utilizator);
    }
}
