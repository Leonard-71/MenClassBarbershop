package MenClass.demo.payload;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserWithSelectedFieldsDTO {
    private Integer utilizatorId;
    private String email;
    private String telefon;
    private String nume;
    private String prenume;
    private String rol;
    private byte[] poza;

    public UserWithSelectedFieldsDTO(Integer utilizatorId, String email, String telefon, String nume, String prenume, String rol,byte[] poza) {
        this.utilizatorId=utilizatorId;
        this.email = email;
        this.telefon = telefon;
        this.nume = nume;
        this.prenume = prenume;
        this.rol = rol;
        this.poza=poza;
    }
}
