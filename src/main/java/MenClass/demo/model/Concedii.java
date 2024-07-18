package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.sql.Date;

@Entity
public class Concedii {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer concediuId;
    private Integer angajatId;
    private Date dataInceput;
    private Date dataSfarsit;
    private String tipConcediu;
    private Date dataSolicitare;
    private String status;
    private String motiv;

    public Concedii() {
    }

    public Concedii(Integer concediuId, Integer angajatId, Date dataInceput, Date dataSfarsit, String tipConcediu, String status, String motiv, Date dataSolicitare) {
        this.concediuId = concediuId;
        this.angajatId = angajatId;
        this.dataInceput = dataInceput;
        this.dataSfarsit = dataSfarsit;
        this.tipConcediu = tipConcediu;
        this.status = status;
        this.motiv = motiv;
        this.dataSolicitare = dataSolicitare;
    }

    @JsonProperty("concediuId")
    public Integer getConcediuId() {
        return concediuId;
    }

    public void setConcediuId(Integer concediuId) {
        this.concediuId = concediuId;
    }

    @JsonProperty("angajatId")
    public Integer getAngajatId() {
        return angajatId;
    }

    public void setAngajatId(Integer angajatId) {
        this.angajatId = angajatId;
    }

    @JsonProperty("dataInceput")
    public Date getDataInceput() {
        return dataInceput;
    }

    public void setDataInceput(Date dataInceput) {
        this.dataInceput = dataInceput;
    }

    @JsonProperty("dataSfarsit")
    public Date getDataSfarsit() {
        return dataSfarsit;
    }

    public void setDataSfarsit(Date dataSfarsit) {
        this.dataSfarsit = dataSfarsit;
    }

    @JsonProperty("tipConcediu")
    public String getTipConcediu() {
        return tipConcediu;
    }

    public void setTipConcediu(String tipConcediu) {
        this.tipConcediu = tipConcediu;
    }

    @JsonProperty("dataSolicitare")
    public Date getDataSolicitare() {
        return dataSolicitare;
    }

    public void setDataSolicitare(Date dataSolicitare) {
        this.dataSolicitare = dataSolicitare;
    }

    @JsonProperty("status")
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @JsonProperty("motiv")
    public String getMotiv() {
        return motiv;
    }

    public void setMotiv(String motiv) {
        this.motiv = motiv;
    }
}
