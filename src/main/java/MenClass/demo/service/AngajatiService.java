package MenClass.demo.service;

import MenClass.demo.model.Angajati;
import MenClass.demo.model.Utilizatori;
import MenClass.demo.payload.AngajatiModificationRequest;
import MenClass.demo.repository.AngajatiRepository;
import MenClass.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AngajatiService {

    private static final Logger logger = LoggerFactory.getLogger(AngajatiService.class);

    private final AngajatiRepository angajatiRepository;
    private final UserRepository userRepository;

    @Autowired
    public AngajatiService(AngajatiRepository angajatiRepository, UserRepository userRepository) {
        this.angajatiRepository = angajatiRepository;
        this.userRepository = userRepository;
    }

    public List<Angajati> getAllAngajati() {
        logger.info("Se preiau toți angajații");
        return angajatiRepository.findAllWithUtilizatori().stream().map(record -> {
            Angajati angajat = (Angajati) record[0];
            angajat.setNume((String) record[1]);
            angajat.setPrenume((String) record[2]);
            angajat.setTelefon((String) record[3]);
            return angajat;
        }).collect(Collectors.toList());
    }

    public List<Angajati> getAngajatById(Integer id) {
        logger.info("Se preia angajatul cu ID-ul: {}", id);
        return angajatiRepository.findwithUtilizator(id).stream().map(record -> {
            Angajati angajat = (Angajati) record[0];
            angajat.setNume((String) record[1]);
            angajat.setPrenume((String) record[2]);
            angajat.setTelefon((String) record[3]);
            return angajat;
        }).collect(Collectors.toList());
    }

    public Angajati addAngajat(Angajati angajat) {
        logger.info("Se adaugă un nou angajat: {}", angajat);
        return angajatiRepository.save(angajat);
    }

    public void updateAngajat(Integer id, AngajatiModificationRequest angajatDetails) {
        logger.info("Se actualizează angajatul cu ID-ul: {}", id);
        Optional<Angajati> optionalAngajat = angajatiRepository.findById(id);
        if (optionalAngajat.isPresent()) {
            Angajati angajat = optionalAngajat.get();
            if (angajatDetails.getDescriere() != null) {
                angajat.setDescriereAngajat(angajatDetails.getDescriere());
            }
            if (angajatDetails.getPoza() != null) {
                angajat.setPozaAngajat(angajatDetails.getPoza());
            }
            if (angajatDetails.getFunctie() != null) {
                angajat.setFunctieAngajat(angajatDetails.getFunctie());
            }
            if (angajatDetails.getLinkFacebook() != null) {
                angajat.setLinkFacebookAngajat(angajatDetails.getLinkFacebook());
            }
            if (angajatDetails.getLinkInstagram() != null) {
                angajat.setLinkInstagramAngajat(angajatDetails.getLinkInstagram());
            }
            angajatiRepository.save(angajat);
            logger.info("Angajatul a fost actualizat cu succes: {}", angajat);
        } else {
            logger.error("Angajatul cu ID-ul {} nu a fost găsit", id);
            throw new RuntimeException("Angajatul nu a fost găsit");
        }
    }

    public String deleteAngajat(Integer id) {
        logger.info("Se șterge angajatul cu ID-ul: {}", id);
        Optional<Angajati> optionalAngajat = angajatiRepository.findById(id);
        if (optionalAngajat.isPresent()) {
            Angajati angajat = optionalAngajat.get();
            Optional<Utilizatori> utilizatorOptional = userRepository.findById(angajat.getUtilizatorID());
            if (utilizatorOptional.isPresent()) {
                Utilizatori user = utilizatorOptional.get();
                user.setRol("ROLE_CLIENT");
                userRepository.save(user);
            }
            angajatiRepository.deleteById(id);
            logger.info("Angajatul cu ID-ul {} a fost șters cu succes", id);
            return "Angajatul a fost șters cu succes";
        } else {
            logger.warn("Angajatul cu ID-ul {} nu a fost găsit", id);
            return "Angajatul nu a fost găsit";
        }
    }

    public Angajati getAngajatByEmail(String email) {
        logger.info("Se preia angajatul cu email-ul: {}", email);
        Angajati angajat = angajatiRepository.findAngajatByEmail(email);
        if (angajat == null) {
            logger.warn("Angajatul cu email-ul {} nu a fost găsit", email);
        }
        return angajat;
    }
}
