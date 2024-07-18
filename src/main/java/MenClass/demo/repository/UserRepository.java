package MenClass.demo.repository;

import MenClass.demo.model.Utilizatori;
import MenClass.demo.payload.UserWithSelectedFieldsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Utilizatori, Integer> {
    Optional<Utilizatori> findByEmail(String email);
    @Query("SELECT new MenClass.demo.payload.UserWithSelectedFieldsDTO(u.utilizatorId,u.email," +
            " u.telefon, u.nume, u.prenume, u.rol,u.poza) FROM Utilizatori u")
    List<UserWithSelectedFieldsDTO> findAllUsers();
    @Modifying
    @Query("DELETE FROM Utilizatori u WHERE u.email = :email")
    void deleteUserByUsername(@Param("email") String email);
    Boolean existsByEmail(String email);
    @Query("Select u FROM Utilizatori u WHERE u.resetPasswordToken = :resetPasswordToken")
    public Utilizatori findByResetPasswordToken(String resetPasswordToken);

    Optional<Utilizatori> findById(Integer id);
}
