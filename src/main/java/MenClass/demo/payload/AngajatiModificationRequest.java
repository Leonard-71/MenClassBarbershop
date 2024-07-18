package MenClass.demo.payload;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@RequiredArgsConstructor
public class AngajatiModificationRequest {
    private String functie;
    private String descriere;
    private String linkInstagram;
    private String linkFacebook;
    private byte[] poza;
}
