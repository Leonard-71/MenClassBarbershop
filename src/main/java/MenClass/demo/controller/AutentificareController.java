package MenClass.demo.controller;

import MenClass.demo.payload.JwtAuthenticationResponse;
import MenClass.demo.payload.LoginDto;
import MenClass.demo.payload.SignUpDto;
import MenClass.demo.security.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequiredArgsConstructor
public class AutentificareController {
    private final AuthenticationService authenticationService;
    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@RequestBody LoginDto request){
        return ResponseEntity.ok(authenticationService.signin(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> registerUser(@RequestBody SignUpDto request){
        return ResponseEntity.ok(authenticationService.signup(request));
    }
}
