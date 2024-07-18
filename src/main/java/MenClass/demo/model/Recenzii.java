package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Timestamp;

public class Recenzii {
    private Integer recenzieId;
    private String email;
    private Double nota;
    private String descriere;
    private Timestamp timestamp;

    public Recenzii() {
    }

    public Recenzii(Integer recenzieId, String email, Double nota, String descriere, Timestamp timestamp) {
        this.recenzieId = recenzieId;
        this.email = email;
        this.nota = nota;
        this.descriere = descriere;
        this.timestamp = timestamp;
    }

    @JsonProperty("recenzieId")
    public Integer getRecenzieId() {
        return recenzieId;
    }

    public void setRecenzieId(Integer recenzieId) {
        this.recenzieId = recenzieId;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonProperty("nota")
    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    @JsonProperty("descriere")
    public String getDescriere() {
        return descriere;
    }

    public void setDescriere(String descriere) {
        this.descriere = descriere;
    }

    @JsonProperty("timestamp")
    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
