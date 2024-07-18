package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "angajati")
@AllArgsConstructor
@NoArgsConstructor
public class Angajati {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "angajat_id")
    private Integer angajatId;

    @Column(name = "functie")
    private String functie;

    @Column(name = "descriere")
    private String descriere;

    @Column(name = "link_instagram")
    private String linkInstagram;

    @Column(name = "link_facebook")
    private String linkFacebook;

    @Column(name = "poza")
    private byte[] poza;

    @Column(name = "utilizator_id")
    private Integer utilizatorId;

    @Transient
    private String nume;

    @Transient
    private String prenume;

    @Transient
    private String telefon;

    // Getters and setters with @JsonProperty annotations
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

    @JsonProperty("angajatId")
    public Integer getAngajatId() {
        return angajatId;
    }

    public void setAngajatId(Integer angajatId) {
        this.angajatId = angajatId;
    }

    @JsonProperty("functie")
    public String getFunctieAngajat() {
        return functie;
    }

    public void setFunctieAngajat(String functie) {
        this.functie = functie;
    }

    @JsonProperty("descriere")
    public String getDescriereAngajat() {
        return descriere;
    }

    public void setDescriereAngajat(String descriere) {
        this.descriere = descriere;
    }

    @JsonProperty("linkInstagram")
    public String getLinkInstagramAngajat() {
        return linkInstagram;
    }

    public void setLinkInstagramAngajat(String linkInstagram) {
        this.linkInstagram = linkInstagram;
    }

    @JsonProperty("linkFacebook")
    public String getLinkFacebookAngajat() {
        return linkFacebook;
    }

    public void setLinkFacebookAngajat(String linkFacebook) {
        this.linkFacebook = linkFacebook;
    }

    @JsonProperty("poza")
    public byte[] getPozaAngajat() {
        return poza;
    }

    public void setPozaAngajat(byte[] poza) {
        this.poza = poza;
    }

    @JsonProperty("utilizatorId")
    public Integer getUtilizatorID() {
        return utilizatorId;
    }

    public void setUtilizatorID(Integer utilizatorId) {
        this.utilizatorId = utilizatorId;
    }
    @Override
    public String toString() {
        return "Angajati{" +
                "angajatId=" + angajatId +
                ", functie='" + functie + '\'' +
                ", descriere='" + descriere + '\'' +
                ", linkInstagram='" + linkInstagram + '\'' +
                ", linkFacebook='" + linkFacebook + '\'' +
                ", utilizatorId=" + utilizatorId +
                ", nume='" + nume + '\'' +
                ", prenume='" + prenume + '\'' +
                ", telefon='" + telefon + '\'' +
                '}';
    }
}
