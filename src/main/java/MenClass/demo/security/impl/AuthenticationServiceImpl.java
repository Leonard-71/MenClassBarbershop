package MenClass.demo.security.impl;

import MenClass.demo.model.Utilizatori;
import MenClass.demo.payload.JwtAuthenticationResponse;
import MenClass.demo.payload.LoginDto;
import MenClass.demo.payload.SignUpDto;
import MenClass.demo.repository.UserRepository;
import MenClass.demo.security.AuthenticationService;
import MenClass.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public JwtAuthenticationResponse signup(SignUpDto request) {

        if (request.getPassword() == null || request.getPasswordConfirmed() == null || !request.getPassword().equals(request.getPasswordConfirmed())) {
            throw new IllegalArgumentException("Parolele nu se potrivesc sau nu au fost completate corect");
        }

        Utilizatori user = Utilizatori.builder()
                .prenume(request.getPrenume())
                .nume(request.getNume())
                .telefon(request.getTelefon())
                .email(request.getEmail())
                .parola(passwordEncoder.encode(request.getPassword()))
                .rol("ROLE_CLIENT")
                .build();

        userRepository.save(user);

        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    @Override
    public JwtAuthenticationResponse signin(LoginDto request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            Utilizatori user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Email sau parolă incorecte."));
            String jwt = jwtService.generateToken(user);
            return JwtAuthenticationResponse.builder().token(jwt).build();
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Email sau parolă incorecte.");
        }
    }

}
