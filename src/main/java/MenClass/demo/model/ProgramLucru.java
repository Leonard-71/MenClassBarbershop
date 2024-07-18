package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Time;

public class ProgramLucru {
    private Integer ziId;
    private String denumire;
    private Time oraDeschidere;
    private Time oraInchidere;

    public ProgramLucru() {
    }

    public ProgramLucru(Integer ziId, String denumire, Time oraDeschidere, Time oraInchidere) {
        this.ziId = ziId;
        this.denumire = denumire;
        this.oraDeschidere = oraDeschidere;
        this.oraInchidere = oraInchidere;
    }

    @JsonProperty("ziId")
    public Integer getZiId() {
        return ziId;
    }

    public void setZiId(Integer ziId) {
        this.ziId = ziId;
    }

    @JsonProperty("denumire")
    public String getDenumireZi() {
        return denumire;
    }

    public void setDenumireZi(String denumire) {
        this.denumire = denumire;
    }

    @JsonProperty("oraDeschidere")
    public Time getOraDeschidereZi() {
        return oraDeschidere;
    }

    public void setOraDeschidereZi(Time oraDeschidere) {
        this.oraDeschidere = oraDeschidere;
    }

    @JsonProperty("oraInchidere")
    public Time getOraInchidereZi() {
        return oraInchidere;
    }

    public void setOraInchidereZi(Time oraInchidere) {
        this.oraInchidere = oraInchidere;
    }
}
