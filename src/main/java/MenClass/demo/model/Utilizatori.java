package MenClass.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import MenClass.demo.utils.Utils;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "utilizatori")
public class Utilizatori implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "utilizator_id")
    private Integer utilizatorId;

    @Column(name = "nume")
    private String nume;

    @Column(name = "prenume")
    private String prenume;

    @Column(name = "email")
    private String email;

    @Column(name = "telefon")
    private String telefon;

    @Column(name = "passwordhash")
    private String parola;

    @Column(name = "rol")
    private String rol;

    @Column(name = "poza")
    private byte[] poza;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @JsonProperty("utilizatorId")
    public Integer getUtilizatorId() {
        return utilizatorId;
    }

    @JsonProperty("nume")
    public String getNumeUtilizator() {
        return nume;
    }

    @JsonProperty("prenume")
    public String getPrenumeUtilizator() {
        return prenume;
    }

    @JsonProperty("email")
    public String getEmailUtilizator() {
        return email;
    }

    @JsonProperty("telefon")
    public String getTelefonUtilizator() {
        return telefon;
    }

    @JsonProperty("parola")
    public String getParolaUtilizator() {
        return parola;
    }

    @JsonProperty("rol")
    public String getRolUtilizator() {
        return rol;
    }

    @JsonProperty("poza")
    public String getPozaUtilizator() {
        return Utils.encodeBase64(this.poza);
    }

    public void setPozaUtilizator(byte[] poza) {
        this.poza = poza;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return parola;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
