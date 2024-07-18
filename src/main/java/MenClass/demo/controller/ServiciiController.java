package MenClass.demo.controller;

import MenClass.demo.model.Servicii;
import MenClass.demo.service.ServiciiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicii")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ServiciiController {
    private ServiciiService serviciiService;

    @Autowired
    public ServiciiController(ServiciiService serviciiService) {
        this.serviciiService = serviciiService;
    }

    /** Returnează toate serviciile. */
    @GetMapping
    public List<Servicii> getServicii() {
        return serviciiService.getServicii();
    }

    /** Adaugă un serviciu nou.*/
    @PostMapping
    public String postServiciu(@RequestBody Servicii serviciu) {
        return serviciiService.addServiciu(serviciu);
    }

    /** Șterge un serviciu după ID. */
    @DeleteMapping("/{serviciuId}")
    public String deleteServiciu(@PathVariable Integer serviciuId) {
        System.out.println("Deleting service with ID: " + serviciuId); // Log pentru verificare
        return serviciiService.deleteServiciu(serviciuId);
    }

    /** Returnează un serviciu după ID.*/
    @GetMapping("/{serviciuId}")
    public Servicii getServiciu(@PathVariable Integer serviciuId) {
        return serviciiService.getServiciu(serviciuId);
    }

    /** Actualizează un serviciu după ID.*/
    @PutMapping("/{serviciuId}")
    public String updateServiciu(@PathVariable Integer serviciuId, @RequestBody Servicii serviciu) {
        return serviciiService.updateServiciu(serviciuId, serviciu);
    }
}
