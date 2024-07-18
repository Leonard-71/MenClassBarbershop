package MenClass.demo.controller;

import MenClass.demo.model.Concedii;
import MenClass.demo.payload.ConcediiModificationRequest;
import MenClass.demo.service.ConcediiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/concedii")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ConcediiController {

    private final ConcediiService concediiService;

    @Autowired
    public ConcediiController(ConcediiService concediiService) {
        this.concediiService = concediiService;
    }

    @GetMapping
    public List<Concedii> getConcedii() {
        return concediiService.getConcedii();
    }

    @GetMapping("/{concediuId}")
    public Concedii getConcediu(@PathVariable Integer concediuId) {
        return concediiService.getConcedii(concediuId);
    }

    @PostMapping
    public ResponseEntity<String> addConcedii(@RequestBody Concedii concedii) {
        return ResponseEntity.ok(concediiService.addConcedii(concedii));
    }

    @DeleteMapping("/{concediuId}")
    public ResponseEntity<String> deleteConcedii(@PathVariable Integer concediuId) {
        return ResponseEntity.ok(concediiService.deleteConcedii(concediuId));
    }

    @PutMapping("/{concediuId}")
    public ResponseEntity<String> updateConcedii(@PathVariable Integer concediuId, @RequestBody ConcediiModificationRequest concediiDetails) {
        return ResponseEntity.ok(concediiService.updateConcedii(concediuId, concediiDetails));
    }

    @GetMapping("/angajat/{angajatId}")
    public List<Concedii> getConcediiByAngajatId(@PathVariable Integer angajatId) {
        return concediiService.getConcediiByAngajatId(angajatId);
    }


}
