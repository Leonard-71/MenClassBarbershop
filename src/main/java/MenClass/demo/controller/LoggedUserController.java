package MenClass.demo.controller;

import MenClass.demo.payload.UserWithSelectedFieldsDTO;
import MenClass.demo.security.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/loggeduser")
@RequiredArgsConstructor
public class LoggedUserController {
    private final UserService userService;

    @GetMapping("/details")
    public ResponseEntity<UserWithSelectedFieldsDTO> getLoggedUserDetails() {
        UserWithSelectedFieldsDTO user = userService.getLoggedInUserDetails();
        return ResponseEntity.ok(user);
    }
}
