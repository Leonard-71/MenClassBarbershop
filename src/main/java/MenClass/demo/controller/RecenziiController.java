package MenClass.demo.controller;

import MenClass.demo.model.Recenzii;
import MenClass.demo.service.RecenziiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recenzii")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class RecenziiController {
    private RecenziiService recenziiService;

    @Autowired
    public RecenziiController(RecenziiService recenziiService) {
        this.recenziiService = recenziiService;
    }

    /** Returnează toate recenziile. */
    @GetMapping
    public List<Recenzii> getRecenzii() {
        return recenziiService.getRecenzii();
    }


    /** Adaugă o recenzie nouă. */
    @PostMapping
    public String postRecenzie(@RequestBody Recenzii recenzie) {
        return recenziiService.addRecenzie(recenzie);
    }

    /** Șterge o recenzie după ID. */
    @DeleteMapping("/{recenzieId}")
    public String deleteRecenzie(@PathVariable Integer recenzieId) {
        return recenziiService.deleteRecenzie(recenzieId);
    }

    /** Returnează o recenzie după ID. */
    @GetMapping("/{recenzieId}")
    public Recenzii getRecenzie(@PathVariable Integer recenzieId) {
        return recenziiService.getRecenzie(recenzieId);
    }

    /** Actualizează o recenzie după ID.*/
    @PutMapping("/{recenzieId}")
    public String updateRecenzie(@PathVariable Integer recenzieId, @RequestBody Recenzii recenzie) {
        return recenziiService.updateRecenzie(recenzieId, recenzie);
    }
}
