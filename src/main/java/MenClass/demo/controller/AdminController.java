package MenClass.demo.controller;

import MenClass.demo.payload.UserDetailsModificationRequest;
import MenClass.demo.payload.UserWithSelectedFieldsDTO;
import MenClass.demo.security.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AdminController {
    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserWithSelectedFieldsDTO>> getAllUsers() {
        List<UserWithSelectedFieldsDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{email}")
    public ResponseEntity<UserWithSelectedFieldsDTO> getUser(@PathVariable String email) {
        UserWithSelectedFieldsDTO user = userService.getUser(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/id/{utilizatorId}")
    public ResponseEntity<UserWithSelectedFieldsDTO> getUserById(@PathVariable Integer utilizatorId) {
        UserWithSelectedFieldsDTO user = userService.getUserById(utilizatorId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{email}")
    public ResponseEntity<String> modifyUserDetails(
            @PathVariable String email,
            @RequestBody UserDetailsModificationRequest userDetailsModificationRequest) {
        userService.modifyUserDetails(email, userDetailsModificationRequest);
        return ResponseEntity.ok("Detaliile utilizatorului au fost modificate cu succes");
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        userService.deleteUser(email);
        return ResponseEntity.ok("User deleted successfully");
    }
}


