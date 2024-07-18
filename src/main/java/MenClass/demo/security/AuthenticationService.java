package MenClass.demo.security;

import MenClass.demo.payload.JwtAuthenticationResponse;
import MenClass.demo.payload.LoginDto;
import MenClass.demo.payload.SignUpDto;

public interface AuthenticationService {
    JwtAuthenticationResponse signup(SignUpDto request);
    JwtAuthenticationResponse signin(LoginDto request);
}
