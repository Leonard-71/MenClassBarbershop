package MenClass.demo.service;

import MenClass.demo.model.ZileLibere;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZileLibereService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ZileLibereService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ZileLibere> getZileLibere() {
        String sql = "SELECT * FROM zilelibere";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new ZileLibere(
                        rs.getInt("zi_libera_id"),
                        rs.getDate("data_zi_libera"),
                        rs.getString("motiv")
                ));
    }

    public String addZileLibere(ZileLibere zileLibere) {
        String sql = "INSERT INTO zilelibere(data_zi_libera, motiv) VALUES (?, ?)";
        int affectedRows = jdbcTemplate.update(sql,
                zileLibere.getDataZiLibera(),
                zileLibere.getMotiv());

        if (affectedRows == 0) {
            return "Crearea zilei libere a eșuat, niciun rând afectat.";
        } else {
            return "Ziua liberă a fost adăugată cu succes.";
        }
    }

    public String deleteZileLibere(Integer ziLiberaId) {
        String sql = "DELETE FROM zilelibere WHERE zi_libera_id = ?";
        int affectedRows = jdbcTemplate.update(sql, ziLiberaId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio zi liberă cu ID: " + ziLiberaId;
        } else {
            return "Ziua liberă cu ID " + ziLiberaId + " a fost ștearsă cu succes.";
        }
    }

    public ZileLibere getZileLibere(Integer ziLiberaId) {
        String sql = "SELECT * FROM zilelibere WHERE zi_libera_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{ziLiberaId}, (rs, rowNum) ->
                new ZileLibere(
                        rs.getInt("zi_libera_id"),
                        rs.getDate("data_zi_libera"),
                        rs.getString("motiv")
                ));
    }

    public String updateZileLibere(Integer ziLiberaId, ZileLibere zileLibere) {
        String updateQuery = "UPDATE zilelibere SET data_zi_libera = ?, motiv = ? WHERE zi_libera_id = ?";
        int affectedRows = jdbcTemplate.update(updateQuery,
                zileLibere.getDataZiLibera(),
                zileLibere.getMotiv(),
                ziLiberaId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio zi liberă cu ID: " + ziLiberaId;
        } else {
            return "Ziua liberă cu ID " + ziLiberaId + " a fost actualizată cu succes.";
        }
    }
}
