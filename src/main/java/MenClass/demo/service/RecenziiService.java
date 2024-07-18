package MenClass.demo.service;

import MenClass.demo.model.Recenzii;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecenziiService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RecenziiService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Recenzii> getRecenzii() {
        String sql = "SELECT * FROM recenzi";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Recenzii(
                        rs.getInt("recenzie_id"),
                        rs.getString("email"),
                        rs.getDouble("nota"),
                        rs.getString("descriere"),
                        rs.getTimestamp("timestamp")
                ));
    }

    public String addRecenzie(Recenzii recenzie) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return "Utilizatorul nu este autentificat.";
        }

        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        if (email == null) {
            return "Utilizatorul nu este autentificat.";
        }

        System.out.println("Emailul utilizatorului: " + email);

        if (recenzie.getDescriere() == null || recenzie.getDescriere().trim().isEmpty()) {
            return "Descrierea recenziei nu poate fi null sau goală.";
        }

        String checkRecenzieSql = "SELECT COUNT(*) FROM recenzi WHERE email = ? AND DATE(timestamp) = CURRENT_DATE";
        Integer count = jdbcTemplate.queryForObject(checkRecenzieSql, new Object[]{email}, Integer.class);

        if (count != null && count > 0) {
            return "Ai trimis deja o recenzie astăzi. Poți trimite o altă recenzie mâine.";
        }

        String insertSql = "INSERT INTO recenzi (email, nota, descriere, timestamp) VALUES (?, ?, ?, ?)";
        int affectedRows = jdbcTemplate.update(insertSql,
                email,
                recenzie.getNota(),
                recenzie.getDescriere(),
                Timestamp.valueOf(LocalDateTime.now()));

        if (affectedRows == 0) {
            return "Crearea recenziei a eșuat, niciun rând afectat.";
        } else {
            return "Recenzia a fost adăugată cu succes.";
        }
    }


    public String deleteRecenzie(Integer recenzieId) {
        String sql = "DELETE FROM recenzi WHERE recenzie_id = ?";
        int affectedRows = jdbcTemplate.update(sql, recenzieId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio recenzie cu ID: " + recenzieId;
        } else {
            return "Recenzia cu ID " + recenzieId + " a fost ștearsă cu succes.";
        }
    }

    public Recenzii getRecenzie(Integer recenzieId) {
        String sql = "SELECT * FROM recenzi WHERE recenzie_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{recenzieId}, (rs, rowNum) ->
                new Recenzii(
                        rs.getInt("recenzie_id"),
                        rs.getString("email"),
                        rs.getDouble("nota"),
                        rs.getString("descriere"),
                        rs.getTimestamp("timestamp")
                ));
    }

    public String updateRecenzie(Integer recenzieId, Recenzii recenzie) {
        String updateQuery = "UPDATE recenzi SET email = ?, nota = ?, descriere = ?, timestamp = ? WHERE recenzie_id = ?";
        int affectedRows = jdbcTemplate.update(updateQuery,
                recenzie.getEmail(),
                recenzie.getNota(),
                recenzie.getDescriere(),
                recenzie.getTimestamp(),
                recenzieId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio recenzie cu ID: " + recenzieId;
        } else {
            return "Recenzia cu ID " + recenzieId + " a fost actualizată cu succes.";
        }
    }
}
