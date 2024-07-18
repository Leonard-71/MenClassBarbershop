package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

public class Programari {
    private Integer programareId;
    private Integer clientId;
    private Integer angajatId;
    private Integer serviciuId;
    private LocalDate dataProgramare;
    private LocalTime oraProgramare;

    private String nume;
    private String prenume;
    private String telefon;

    public Programari() {
    }
    public Programari(Integer programareId, Integer clientId, Integer angajatId, Integer serviciuId, LocalDate dataProgramare, LocalTime oraProgramare, String nume, String prenume, String telefon) {
        this.programareId = programareId;
        this.clientId = clientId;
        this.angajatId = angajatId;
        this.serviciuId = serviciuId;
        this.dataProgramare = dataProgramare;
        this.oraProgramare = oraProgramare;
        this.nume = nume;
        this.prenume = prenume;
        this.telefon = telefon;
    }

    @JsonProperty("programareId")
    public Integer getProgramareId() {
        return programareId;
    }

    public void setProgramareId(Integer programareId) {
        this.programareId = programareId;
    }

    @JsonProperty("clientId")
    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    @JsonProperty("angajatId")
    public Integer getAngajatId() {
        return angajatId;
    }

    public void setAngajatId(Integer angajatId) {
        this.angajatId = angajatId;
    }

    @JsonProperty("serviciuId")
    public Integer getServiciuId() {
        return serviciuId;
    }

    public void setServiciuId(Integer serviciuId) {
        this.serviciuId = serviciuId;
    }

    @JsonProperty("dataProgramare")
    public LocalDate getDataProgramare() {
        return dataProgramare;
    }

    public void setDataProgramare(LocalDate dataProgramare) {
        this.dataProgramare = dataProgramare;
    }

    @JsonProperty("oraProgramare")
    public LocalTime getOraProgramare() {
        return oraProgramare;
    }

    public void setOraProgramare(LocalTime oraProgramare) {
        this.oraProgramare = oraProgramare;
    }
    @JsonProperty("nume")
    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }
    @JsonProperty("prenume")
    public String getPrenume() {
        return prenume;
    }

    public void setPrenume(String prenume) {
        this.prenume = prenume;
    }
    @JsonProperty("telefon")
    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }
}
