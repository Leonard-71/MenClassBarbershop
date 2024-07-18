package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class Servicii {
    private Integer serviciuId;
    private String denumire;
    private String descriereServiciu;
    private Integer durata;
    private BigDecimal pret;

    public Servicii() {
    }

    public Servicii(Integer serviciuId, String denumire, String descriereServiciu, Integer durata, BigDecimal pret) {
        this.serviciuId = serviciuId;
        this.denumire = denumire;
        this.descriereServiciu = descriereServiciu;
        this.durata = durata;
        this.pret = pret;
    }

    @JsonProperty("serviciuId")
    public Integer getServiciuId() {
        return serviciuId;
    }

    public void setServiciuId(Integer serviciuId) {
        this.serviciuId = serviciuId;
    }

    @JsonProperty("denumire")
    public String getDenumire() {
        return denumire;
    }

    public void setDenumire(String denumire) {
        this.denumire = denumire;
    }

    @JsonProperty("descriereServiciu")
    public String getDescriereServiciu() {
        return descriereServiciu;
    }

    public void setDescriereServiciu(String descriereServiciu) {
        this.descriereServiciu = descriereServiciu;
    }

    @JsonProperty("durata")
    public Integer getDurata() {
        return durata;
    }

    public void setDurata(Integer durata) {
        this.durata = durata;
    }

    @JsonProperty("pret")
    public BigDecimal getPret() {
        return pret;
    }

    public void setPret(BigDecimal pret) {
        this.pret = pret;
    }
}
