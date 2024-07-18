package MenClass.demo.service;

import MenClass.demo.model.Servicii;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiciiService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ServiciiService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Servicii> getServicii() {
        String sql = "SELECT * FROM servicii";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Servicii(
                        rs.getInt("serviciu_id"),
                        rs.getString("denumire"),
                        rs.getString("descriereServiciu"),
                        rs.getInt("durata"),
                        rs.getBigDecimal("pret")
                ));
    }

    public String addServiciu(Servicii serviciu) {
        String sql = "INSERT INTO servicii(denumire, descriereServiciu, durata, pret) VALUES (?, ?, ?, ?)";
        int affectedRows = jdbcTemplate.update(sql,
                serviciu.getDenumire(),
                serviciu.getDescriereServiciu(),
                serviciu.getDurata(),
                serviciu.getPret());

        if (affectedRows == 0) {
            return "Crearea serviciului a eșuat, niciun rând afectat.";
        } else {
            return "Serviciul a fost adăugat cu succes.";
        }
    }

    public String deleteServiciu(Integer serviciuId) {
        String deleteProgramariSql = "DELETE FROM programari WHERE serviciu_id = ?";
        jdbcTemplate.update(deleteProgramariSql, serviciuId);

        String deleteServiciuSql = "DELETE FROM servicii WHERE serviciu_id = ?";
        int affectedRows = jdbcTemplate.update(deleteServiciuSql, serviciuId);

        if (affectedRows == 0) {
            return "Nu s-a găsit niciun serviciu cu ID: " + serviciuId;
        } else {
            return "Serviciul cu ID " + serviciuId + " a fost șters cu succes.";
        }
    }

    public Servicii getServiciu(Integer serviciuId) {
        String sql = "SELECT * FROM servicii WHERE serviciu_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{serviciuId}, (rs, rowNum) ->
                new Servicii(
                        rs.getInt("serviciu_id"),
                        rs.getString("denumire"),
                        rs.getString("descriereServiciu"),
                        rs.getInt("durata"),
                        rs.getBigDecimal("pret")
                ));
    }

    public String updateServiciu(Integer serviciuId, Servicii serviciu) {
        String updateQuery = "UPDATE servicii SET denumire = ?, descriereServiciu = ?, durata = ?, pret = ? WHERE serviciu_id = ?";
        int affectedRows = jdbcTemplate.update(updateQuery,
                serviciu.getDenumire(),
                serviciu.getDescriereServiciu(),
                serviciu.getDurata(),
                serviciu.getPret(),
                serviciuId);

        if (affectedRows == 0) {
            return "Nu s-a găsit niciun serviciu cu ID: " + serviciuId;
        } else {
            return "Serviciul cu ID " + serviciuId + " a fost actualizat cu succes.";
        }
    }
}
