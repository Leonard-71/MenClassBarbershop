package MenClass.demo.service;

import MenClass.demo.model.Galerie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GalerieService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public GalerieService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Galerie> getGalerie() {
        String sql = "SELECT * FROM galerie";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Galerie(
                        rs.getInt("poza_id"),
                        rs.getBytes("poza")
                ));
    }

    public String addImagine(Galerie galerie) {
        String sql = "INSERT INTO galerie(poza) VALUES (?)";
        int affectedRows = jdbcTemplate.update(sql, galerie.getPoza());

        if (affectedRows == 0) {
            return "Crearea imaginii a eșuat, niciun rând afectat.";
        } else {
            return "Imaginea a fost adăugată cu succes.";
        }
    }

    public String deleteImagine(Integer pozaId) {
        String sql = "DELETE FROM galerie WHERE poza_id = ?";
        int affectedRows = jdbcTemplate.update(sql, pozaId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio imagine cu ID: " + pozaId;
        } else {
            return "Imaginea cu ID " + pozaId + " a fost ștearsă cu succes.";
        }
    }

    public Galerie getImagine(Integer pozaId) {
        String sql = "SELECT * FROM galerie WHERE poza_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{pozaId}, (rs, rowNum) ->
                new Galerie(
                        rs.getInt("poza_id"),
                        rs.getBytes("poza")
                ));
    }

    public String updateImagine(Integer pozaId, Galerie galerie) {
        String updateQuery = "UPDATE galerie SET poza = ? WHERE poza_id = ?";
        int affectedRows = jdbcTemplate.update(updateQuery, galerie.getPoza(), pozaId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio imagine cu ID: " + pozaId;
        } else {
            return "Imaginea cu ID " + pozaId + " a fost actualizată cu succes.";
        }
    }
}
