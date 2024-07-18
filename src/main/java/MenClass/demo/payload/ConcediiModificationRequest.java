package MenClass.demo.payload;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Data
@Getter
@Setter
@RequiredArgsConstructor
public class ConcediiModificationRequest {
    private Date dataInceput;
    private Date dataSfarsit;
    private String tipConcediu;
    private String status;
    private String motiv;
}
