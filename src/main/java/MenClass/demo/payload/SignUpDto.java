package MenClass.demo.payload;

import lombok.Data;

@Data
public class SignUpDto {
    private String email;
    private String telefon;
    private String nume;
    private String prenume;
    private String password;
    private String passwordConfirmed;
}
