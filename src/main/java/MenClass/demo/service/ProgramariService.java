package MenClass.demo.service;

import MenClass.demo.model.Programari;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgramariService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProgramariService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private String validateProgramare(Programari programari) {
        LocalDate dataProgramare = programari.getDataProgramare();
        LocalTime oraProgramare = programari.getOraProgramare();
        int dayOfWeek = dataProgramare.getDayOfWeek().getValue();

        if (dataProgramare.isBefore(LocalDate.now()) || (dataProgramare.isEqual(LocalDate.now()) && oraProgramare.isBefore(LocalTime.now()))) {
            return "Data programării nu poate fi în trecut.";
        }

        String checkLeaveSql = "SELECT COUNT(*) FROM concedii WHERE angajat_id = ? AND ? BETWEEN data_inceput AND data_sfarsit";
        Integer leaveCount = jdbcTemplate.queryForObject(checkLeaveSql, new Object[]{programari.getAngajatId(), dataProgramare}, Integer.class);
        if (leaveCount == null || leaveCount > 0) {
            return "Angajatul este în concediu în data programată.";
        }

        String checkDayOffSql = "SELECT COUNT(*) FROM zilelibere WHERE data_zi_libera = ?";
        Integer dayOffCount = jdbcTemplate.queryForObject(checkDayOffSql, new Object[]{dataProgramare}, Integer.class);
        if (dayOffCount == null || dayOffCount > 0) {
            return "Frizeria are zi liberă în data programată.";
        }

        // Retrieve the working hours for the day
        String getWorkingHoursSql = "SELECT ora_deschidere, ora_inchidere FROM programlucru WHERE zi_id = ?";
        Map<String, LocalTime> workingHours = jdbcTemplate.queryForObject(getWorkingHoursSql, new Object[]{dayOfWeek}, (rs, rowNum) -> {
            Map<String, LocalTime> map = new HashMap<>();
            map.put("ora_deschidere", rs.getTime("ora_deschidere").toLocalTime());
            map.put("ora_inchidere", rs.getTime("ora_inchidere").toLocalTime());
            return map;
        });

        LocalTime oraDeschidere = workingHours.get("ora_deschidere");
        LocalTime oraInchidere = workingHours.get("ora_inchidere");


        if (oraProgramare.isBefore(oraDeschidere) || oraProgramare.isAfter(oraInchidere)) {
            return "Programarea nu este în cadrul orelor de lucru ale companiei.";
        }

        String getServiceDurationSql = "SELECT durata FROM servicii WHERE serviciu_id = ?";
        Integer durataServiciu = jdbcTemplate.queryForObject(getServiceDurationSql, new Object[]{programari.getServiciuId()}, Integer.class);
        if (durataServiciu == null) {
            return "Durata serviciului nu a putut fi găsită.";
        }

        LocalTime oraSfarsitProgramare = oraProgramare.plusMinutes(durataServiciu);
        if (oraSfarsitProgramare.isAfter(oraInchidere)) {
            return "Durata serviciului depășește ora de închidere a companiei.";
        }

        String checkOverlappingAppointmentsSql = "SELECT COUNT(*) FROM programari WHERE angajat_id = ? AND (?::date, ?::time + INTERVAL '1 minute' * ?) OVERLAPS (data_programare, ora_programare + INTERVAL '1 minute' * ?)";
        Integer overlappingAppointmentsCount = jdbcTemplate.queryForObject(
                checkOverlappingAppointmentsSql,
                new Object[]{
                        programari.getAngajatId(),
                        dataProgramare,
                        oraProgramare,
                        durataServiciu,
                        durataServiciu
                },
                Integer.class
        );
        if (overlappingAppointmentsCount == null || overlappingAppointmentsCount > 1) {
            return "Există deja o programare în intervalul selectat pentru acest angajat.";
        }

        return "Valid";
    }



    public List<Programari> getProgramari() {
        String sql = "SELECT * FROM programari";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public String addProgramari(Programari programari) {
        String validationMessage = validateProgramare(programari);
        if (!validationMessage.equals("Valid")) {
            return validationMessage;
        }
        else {
            if (programari.getNume() == null && programari.getPrenume() == null && programari.getTelefon() == null) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = null;

                if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
                    email = userDetails.getUsername();
                }

                if (email == null) {
                    return "Utilizatorul nu este autentificat.";
                }

                String getUserIdSql = "SELECT utilizator_id FROM utilizatori WHERE email = ?";
                Integer utilizatorId = null;
                try {
                    utilizatorId = jdbcTemplate.queryForObject(getUserIdSql, new Object[]{email}, Integer.class);
                } catch (EmptyResultDataAccessException e) {
                    return "Nu s-a găsit niciun utilizator cu acest email.";
                }

                if (utilizatorId == null) {
                    return "Nu s-a găsit niciun utilizator cu acest email.";
                }

                String sql = "INSERT INTO programari(client_id, angajat_id, serviciu_id, data_programare, ora_programare) VALUES (?, ?, ?, ?, ?)";
                int affectedRows = jdbcTemplate.update(sql,
                        utilizatorId,
                        programari.getAngajatId(),
                        programari.getServiciuId(),
                        programari.getDataProgramare(),
                        programari.getOraProgramare());

                if (affectedRows == 0) {
                    return "Crearea programării a eșuat, niciun rând afectat.";
                } else {
                    return "Programarea a fost adăugată cu succes.";
                }
            } else if (programari.getNume() != null && programari.getPrenume() != null && programari.getTelefon() != null) {
                String sql = "INSERT INTO programari(angajat_id, serviciu_id, data_programare, ora_programare, nume, prenume, telefon) VALUES (?, ?, ?, ?, ?, ?, ?)";
                int affectedRows = jdbcTemplate.update(sql,
                        programari.getAngajatId(),
                        programari.getServiciuId(),
                        programari.getDataProgramare(),
                        programari.getOraProgramare(),
                        programari.getNume(),
                        programari.getPrenume(),
                        programari.getTelefon());

                if (affectedRows == 0) {
                    return "Crearea programării a eșuat, niciun rând afectat.";
                } else {
                    return "Programarea a fost adăugată cu succes.";
                }
            } else {
                return "Numele, prenumele sau numarul de telefon nu au fost introduse pentru client";
            }
        }
    }


    public String deleteProgramari(Integer programareId) {
        String sql = "DELETE FROM programari WHERE programare_id = ?";
        int affectedRows = jdbcTemplate.update(sql, programareId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio programare cu ID: " + programareId;
        } else {
            return "Programarea  a fost ștearsă cu succes.";
        }
    }

    public Programari getProgramari(Integer programareId) {
        String sql = "SELECT * FROM programari WHERE programare_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{programareId}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public String updateProgramari(Integer programareId, Programari programari) {
        String validationMessage = validateProgramare(programari);
        if (!validationMessage.equals("Valid")) {
            return validationMessage;
        }
        String updateQuery = "UPDATE programari SET client_id = ?, angajat_id = ?, serviciu_id = ?, data_programare = ?, ora_programare = ?, nume = ?, prenume = ?, telefon = ? WHERE programare_id = ?";

        int affectedRows = jdbcTemplate.update(updateQuery,
                programari.getClientId(),
                programari.getAngajatId(),
                programari.getServiciuId(),
                programari.getDataProgramare(),
                programari.getOraProgramare(),
                programari.getNume(),
                programari.getPrenume(),
                programari.getTelefon(),
                programareId);

        if (affectedRows == 0) {
            return "Nu s-a găsit nicio programare cu ID: " + programareId;
        } else {
            return "Programarea a fost actualizată cu succes.";
        }
    }


    public List<Programari> getProgramariByClientId(Integer clientId) {
        String sql = "SELECT * FROM programari WHERE client_id = ?";
        return jdbcTemplate.query(sql, new Object[]{clientId}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public List<Programari> getProgramariByNumeClient(String nume) {
        String sql = "SELECT p.* FROM programari p, utilizatori u WHERE u.nume ILIKE ? AND u.utilizator_id = p.client_id";
        String namePattern = nume + "%";
        return jdbcTemplate.query(sql, new Object[]{namePattern}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public List<Programari> getProgramariByPrenumeClient(String prenume) {
        String sql = "SELECT p.* FROM programari p, utilizatori u WHERE u.prenume ILIKE ? AND u.utilizator_id = p.client_id";
        String namePattern = prenume + "%";
        return jdbcTemplate.query(sql, new Object[]{namePattern}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public List<Programari> getProgramariByNumePrenumeClient(String nume, String prenume) {
        String sql = "SELECT p.* FROM programari p, utilizatori u WHERE u.nume ILIKE ? AND u.prenume ILIKE ? AND u.utilizator_id = p.client_id";
        String namePattern1 = nume + "%";
        String namePattern2 = prenume + "%";
        return jdbcTemplate.query(sql, new Object[]{namePattern1, namePattern2}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public List<Programari> getProgramariByNumeServiciu(String numeServiciu) {
        String sql = "SELECT p.* FROM programari p, servicii s WHERE s.denumire ILIKE ? AND p.serviciu_id = s.serviciu_id";
        String namePattern = numeServiciu + "%";
        return jdbcTemplate.query(sql, new Object[]{namePattern}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public List<Programari> getProgramariByDataProgramare(LocalDate dataProgramare) {
        String sql = "SELECT * FROM programari WHERE data_programare = ?";
        return jdbcTemplate.query(sql, new Object[]{dataProgramare}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }

    public List<Programari> getProgramariByOraProgramare(LocalTime oraProgramare) {
        String sql = "SELECT * FROM programari WHERE ora_programare = ?";
        return jdbcTemplate.query(sql, new Object[]{oraProgramare}, (rs, rowNum) ->
                new Programari(
                        rs.getInt("programare_id"),
                        rs.getInt("client_id"),
                        rs.getInt("angajat_id"),
                        rs.getInt("serviciu_id"),
                        rs.getDate("data_programare").toLocalDate(),
                        rs.getTime("ora_programare").toLocalTime(),
                        rs.getString("nume"),
                        rs.getString("prenume"),
                        rs.getString("telefon")
                ));
    }
}
