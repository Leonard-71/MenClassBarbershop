package MenClass.demo.controller;

import MenClass.demo.model.Galerie;
import MenClass.demo.service.GalerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/galerie")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class GalerieController {
    private GalerieService galerieService;

    @Autowired
    public GalerieController(GalerieService galerieService) {
        this.galerieService = galerieService;
    }

    /** Returnează toate imaginile din galerie.*/
    @GetMapping
    public List<Galerie> getGalerie() {
        return galerieService.getGalerie();
    }

    /** Adaugă o imagine nouă în galerie.*/
    @PostMapping
    public String postImagine(@RequestBody Galerie galerie) {
        return galerieService.addImagine(galerie);
    }

    /** Șterge o imagine din galerie după ID.*/
    @DeleteMapping("/{pozaId}")
    public String deleteImagine(@PathVariable Integer pozaId) {
        return galerieService.deleteImagine(pozaId);
    }

    /** Returnează o imagine din galerie după ID.*/
    @GetMapping("/{pozaId}")
    public Galerie getImagine(@PathVariable Integer pozaId) {
        return galerieService.getImagine(pozaId);
    }

    /** Actualizează o imagine din galerie după ID.*/
    @PutMapping("/{pozaId}")
    public String updateImagine(@PathVariable Integer pozaId, @RequestBody Galerie galerie) {
        return galerieService.updateImagine(pozaId, galerie);
    }
}
