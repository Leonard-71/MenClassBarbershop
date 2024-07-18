package MenClass.demo.service;

import MenClass.demo.model.ProgramLucru;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;

@Service
public class ProgramLucruService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProgramLucruService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ProgramLucru> getProgramLucru() {
        String sql = "SELECT * FROM programlucru";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new ProgramLucru(
                        rs.getInt("zi_id"),
                        rs.getString("denumire"),
                        rs.getTime("ora_deschidere"),
                        rs.getTime("ora_inchidere")
                ));
    }

    public String addProgramLucru(ProgramLucru programLucru) {
        String sql = "INSERT INTO programlucru(denumire, ora_deschidere, ora_inchidere) VALUES (?, ?, ?)";
        int affectedRows = jdbcTemplate.update(sql,
                programLucru.getDenumireZi(),
                programLucru.getOraDeschidereZi(),
                programLucru.getOraInchidereZi());

        if (affectedRows == 0) {
            return "Crearea zilei de lucru a eșuat, niciun rând afectat.";
        } else {
            return "Ziua de lucru a fost adăugat cu succes.";
        }
    }

    public String deleteProgramLucru(String denumire) {
        String sql = "DELETE FROM programlucru WHERE denumire = ?";
        int affectedRows = jdbcTemplate.update(sql, denumire);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio zi de lucru cu denumirea: " + denumire;
        } else {
            return "Ziua de lucru cu denumirea " + denumire + " a fost șters cu succes.";
        }
    }

    public ProgramLucru getProgramLucru(String denumire) {
        String sql = "SELECT * FROM programlucru WHERE denumire = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{denumire}, (rs, rowNum) ->
                new ProgramLucru(
                        rs.getInt("zi_id"),
                        rs.getString("denumire"),
                        rs.getTime("ora_deschidere"),
                        rs.getTime("ora_inchidere")
                ));
    }

    public String updateProgramLucru(String denumire, ProgramLucru programLucru) {
        String updateQuery = "UPDATE programlucru SET ora_deschidere = ?, ora_inchidere = ? WHERE denumire = ?";
        int affectedRows = jdbcTemplate.update(updateQuery,
                programLucru.getOraDeschidereZi(),
                programLucru.getOraInchidereZi(),
                denumire);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio zi de lucru cu denumirea: " + denumire;
        } else {
            return "Ziua de lucru cu denumirea " + denumire + " a fost actualizat cu succes.";
        }
    }
}
