package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Date;

public class ZileLibere {
    private Integer ziLiberaId;
    private Date dataZiLibera;
    private String motiv;

    public ZileLibere() {
    }

    public ZileLibere(Integer ziLiberaId, Date dataZiLibera, String motiv) {
        this.ziLiberaId = ziLiberaId;
        this.dataZiLibera = dataZiLibera;
        this.motiv = motiv;
    }

    @JsonProperty("ziLiberaId")
    public Integer getZiLiberaId() {
        return ziLiberaId;
    }

    public void setZiLiberaId(Integer ziLiberaId) {
        this.ziLiberaId = ziLiberaId;
    }

    @JsonProperty("dataZiLibera")
    public Date getDataZiLibera() {
        return dataZiLibera;
    }

    public void setDataZiLibera(Date dataZiLibera) {
        this.dataZiLibera = dataZiLibera;
    }

    @JsonProperty("motiv")
    public String getMotiv() {
        return motiv;
    }

    public void setMotiv(String motiv) {
        this.motiv = motiv;
    }
}
