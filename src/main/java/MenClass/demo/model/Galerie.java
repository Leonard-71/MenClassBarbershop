package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Galerie {
    private Integer pozaId;
    private byte[] poza;

    public Galerie() {
    }

    public Galerie(Integer pozaId, byte[] poza) {
        this.pozaId = pozaId;
        this.poza = poza;
    }

    @JsonProperty("pozaId")
    public Integer getPozaId() {
        return pozaId;
    }

    public void setPozaId(Integer pozaId) {
        this.pozaId = pozaId;
    }

    @JsonProperty("poza")
    public byte[] getPoza() {
        return poza;
    }

    public void setPoza(byte[] poza) {
        this.poza = poza;
    }
}
