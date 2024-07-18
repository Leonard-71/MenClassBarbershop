package MenClass.demo.service;

import MenClass.demo.model.Concedii;
import MenClass.demo.payload.ConcediiModificationRequest;
import MenClass.demo.repository.ConcediiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ConcediiService {

    private final ConcediiRepository concediiRepository;

    @Autowired
    public ConcediiService(ConcediiRepository concediiRepository) {
        this.concediiRepository = concediiRepository;
    }

    public List<Concedii> getConcedii() {
        return concediiRepository.findAll();
    }

    public Concedii getConcedii(Integer concediuId) {
        return concediiRepository.findById(concediuId).orElse(null);
    }

    public List<Concedii> getConcediiByAngajatId(Integer angajatId) {
        return concediiRepository.findByAngajatId(angajatId);
    }

    public String addConcedii(Concedii concedii) {
        concediiRepository.save(concedii);
        return "Concediul a fost adăugat cu succes.";
    }

    public String deleteConcedii(Integer concediuId) {
        concediiRepository.deleteById(concediuId);
        return "Concediul cu ID " + concediuId + " a fost șters cu succes.";
    }

    public String updateConcedii(Integer concediuId, ConcediiModificationRequest concediiDetails) {
        Optional<Concedii> optionalConcediu = concediiRepository.findById(concediuId);
        if (optionalConcediu.isPresent()) {
            Concedii concediu = optionalConcediu.get();
            if(concediiDetails.getDataInceput() != null) {
                concediu.setDataInceput(concediiDetails.getDataInceput());
            }
            if(concediiDetails.getDataSfarsit() != null) {
                concediu.setDataSfarsit(concediiDetails.getDataSfarsit());
            }
            if(concediiDetails.getTipConcediu() != null) {
                concediu.setTipConcediu(concediiDetails.getTipConcediu());
            }
            if(concediiDetails.getStatus() != null) {
                concediu.setStatus(concediiDetails.getStatus());
            }
            if(concediiDetails.getMotiv() != null) {
                concediu.setMotiv(concediiDetails.getMotiv());
            }
            concediiRepository.save(concediu);
            return "Concediu cu ID " + concediuId + " a fost actualizat cu succes.";
        } else {
            return "Nu s-a găsit niciun concediu cu ID: " + concediuId;
        }
    }
}
