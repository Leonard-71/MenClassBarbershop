package MenClass.demo.repository;

import MenClass.demo.model.Angajati;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AngajatiRepository extends JpaRepository<Angajati, Integer> {

    @Query("SELECT a, u.nume, u.prenume, u.telefon FROM Angajati a LEFT JOIN Utilizatori u ON a.utilizatorId = u.utilizatorId")
    List<Object[]> findAllWithUtilizatori();

    @Query("SELECT a, u.nume, u.prenume, u.telefon FROM Angajati a LEFT JOIN Utilizatori u ON a.utilizatorId = u.utilizatorId WHERE a.angajatId = :angajatId")
    List<Object[]> findwithUtilizator(@Param("angajatId") Integer angajatId);

    @Query("SELECT a FROM Angajati a LEFT JOIN Utilizatori u ON a.utilizatorId = u.utilizatorId WHERE u.email = :email")
    Angajati findAngajatByEmail(@Param("email") String email);
}
