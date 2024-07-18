package MenClass.demo.controller;

import MenClass.demo.model.Programari;
import MenClass.demo.service.ProgramariService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/programari")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ProgramariController {
    private ProgramariService programariService;

    @Autowired
    public ProgramariController(ProgramariService programariService) {
        this.programariService = programariService;
    }

    @GetMapping
    public List<Programari> getProgramari() {
        return programariService.getProgramari();
    }

    @PostMapping
    public String postProgramare(@RequestBody Programari programare) {
        return programariService.addProgramari(programare);
    }

    @DeleteMapping("/{programareId}")
    public String deleteProgramare(@PathVariable Integer programareId) {
        return programariService.deleteProgramari(programareId);
    }

    @GetMapping("/{programareId}")
    public Programari getProgramare(@PathVariable Integer programareId) {
        return programariService.getProgramari(programareId);
    }

    @PutMapping("/{programareId}")
    public String updateProgramare(@PathVariable Integer programareId, @RequestBody Programari programare) {
        return programariService.updateProgramari(programareId, programare);
    }


    @GetMapping("/client/{clientId}")
    public List<Programari> getProgramariByClientId(@PathVariable Integer clientId) {
        return programariService.getProgramariByClientId(clientId);
    }

    @GetMapping("/client/nume/{nume}")
    public List<Programari> getProgramariByNumeClient(@PathVariable String nume) {
        return programariService.getProgramariByNumeClient(nume);
    }

    @GetMapping("/client/prenume/{prenume}")
    public List<Programari> getProgramariByPrenumeClient(@PathVariable String prenume) {
        return programariService.getProgramariByPrenumeClient(prenume);
    }

    @GetMapping("/client/nume-prenume/{nume}/{prenume}")
    public List<Programari> getProgramariByNumePrenumeClient(@PathVariable String nume, @PathVariable String prenume) {
        return programariService.getProgramariByNumePrenumeClient(nume, prenume);
    }

    @GetMapping("/serviciu/nume/{numeServiciu}")
    public List<Programari> getProgramariByNumeServiciu(@PathVariable String numeServiciu) {
        return programariService.getProgramariByNumeServiciu(numeServiciu);
    }

    @GetMapping("/data/{dataProgramare}")
    public List<Programari> getProgramariByDataProgramare(@PathVariable LocalDate dataProgramare) {
        return programariService.getProgramariByDataProgramare(dataProgramare);
    }

    @GetMapping("/ora/{oraProgramare}")
    public List<Programari> getProgramariByOraProgramare(@PathVariable LocalTime oraProgramare) {
        return programariService.getProgramariByOraProgramare(oraProgramare);
    }
}
