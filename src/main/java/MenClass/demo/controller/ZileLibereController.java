package MenClass.demo.controller;

import MenClass.demo.model.ZileLibere;
import MenClass.demo.service.ZileLibereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zilelibere")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ZileLibereController {
    private ZileLibereService zileLibereService;

    @Autowired
    public ZileLibereController(ZileLibereService zileLibereService) {
        this.zileLibereService = zileLibereService;
    }

    /** Returnează toate zilele libere. */
    @GetMapping
    public List<ZileLibere> getZileLibere() {
        return zileLibereService.getZileLibere();
    }

    /** Adaugă o zi liberă nouă.*/
    @PostMapping
    public String postZiLibera(@RequestBody ZileLibere ziLibera) {
        return zileLibereService.addZileLibere(ziLibera);
    }

    /** Șterge o zi liberă după ID. */
    @DeleteMapping("/{ziLiberaId}")
    public String deleteZiLibera(@PathVariable Integer ziLiberaId) {
        return zileLibereService.deleteZileLibere(ziLiberaId);
    }

    /**  Returnează o zi liberă după ID. */
    @GetMapping("/{ziLiberaId}")
    public ZileLibere getZiLibera(@PathVariable Integer ziLiberaId) {
        return zileLibereService.getZileLibere(ziLiberaId);
    }

    /** Actualizează o zi liberă după ID. */
    @PutMapping("/{ziLiberaId}")
    public String updateZiLibera(@PathVariable Integer ziLiberaId, @RequestBody ZileLibere ziLibera) {
        return zileLibereService.updateZileLibere(ziLiberaId, ziLibera);
    }
}
