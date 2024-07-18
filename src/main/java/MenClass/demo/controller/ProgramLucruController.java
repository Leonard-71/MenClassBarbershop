package MenClass.demo.controller;

import MenClass.demo.model.ProgramLucru;
import MenClass.demo.service.ProgramLucruService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programlucru")
@CrossOrigin(origins = {"http://192.168.0.104:3000", "http://localhost:3000"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ProgramLucruController {
    private ProgramLucruService programLucruService;

    @Autowired
    public ProgramLucruController(ProgramLucruService programLucruService) {
        this.programLucruService = programLucruService;
    }

    /** Returnează toate programele de lucru. */
    @GetMapping
    public List<ProgramLucru> getProgramLucru() {
        return programLucruService.getProgramLucru();
    }

    /**  Adaugă un program de lucru nou.*/
    @PostMapping
    public String postProgramLucru(@RequestBody ProgramLucru programLucru) {
        return programLucruService.addProgramLucru(programLucru);
    }

    /** Șterge un program de lucru după denumiru. */
    @DeleteMapping("/{denumire}")
    public String deleteProgramLucru(@PathVariable String denumire) {
        return programLucruService.deleteProgramLucru(denumire);
    }

    /** Returnează un program de lucru după denumire.*/
    @GetMapping("/{denumire}")
    public ProgramLucru getProgramLucru(@PathVariable String denumire) {
        return programLucruService.getProgramLucru(denumire);
    }

    /** Actualizează un program de lucru după denumire. */
    @PutMapping("/{denumire}")
    public String updateProgramLucru(@PathVariable String denumire, @RequestBody ProgramLucru programLucru) {
        return programLucruService.updateProgramLucru(denumire, programLucru);
    }
}
