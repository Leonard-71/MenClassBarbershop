package MenClass.demo.repository;

import MenClass.demo.model.Concedii;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConcediiRepository extends JpaRepository<Concedii, Integer> {

    List<Concedii> findByAngajatId(Integer angajatId);
}
