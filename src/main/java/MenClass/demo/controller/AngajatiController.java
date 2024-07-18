package MenClass.demo.controller;

import MenClass.demo.model.Angajati;
import MenClass.demo.payload.AngajatiModificationRequest;
import MenClass.demo.service.AngajatiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/angajati")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AngajatiController {

    private final AngajatiService angajatiService;

    @Autowired
    public AngajatiController(AngajatiService angajatiService) {
        this.angajatiService = angajatiService;
    }

    @GetMapping
    public List<Angajati> getAllAngajati() {
        return angajatiService.getAllAngajati();
    }

    @GetMapping("/{id}")
    public List<Angajati> getAngajatById(@PathVariable Integer id) {
        return angajatiService.getAngajatById(id);
    }

    @GetMapping("/email")
    public ResponseEntity<Angajati> getAngajatByEmail(@RequestParam String email) {
        Angajati angajat = angajatiService.getAngajatByEmail(email);
        if (angajat != null) {
            return ResponseEntity.ok(angajat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Angajati addAngajat(@RequestBody Angajati angajat) {
        return angajatiService.addAngajat(angajat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAngajat(@PathVariable Integer id, @RequestBody AngajatiModificationRequest angajatDetails) {
        angajatiService.updateAngajat(id, angajatDetails);
        return ResponseEntity.ok("Angajatul a fost modificat cu sucess");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAngajat(@PathVariable Integer id) {
        String mesaj = angajatiService.deleteAngajat(id);
        if (mesaj.equals("Angajatul a fost șters cu succes")) {
            return ResponseEntity.ok(mesaj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mesaj);
        }
    }
}
