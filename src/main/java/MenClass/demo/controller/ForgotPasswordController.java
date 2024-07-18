package MenClass.demo.controller;

import MenClass.demo.model.Utilizatori;
import MenClass.demo.repository.UserRepository;
import MenClass.demo.security.UserService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.apache.commons.lang3.RandomStringUtils;
import MenClass.demo.utility.Utility;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
@RequestMapping("/api")
@RestController
public class ForgotPasswordController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/forgot_password")
    public ResponseEntity<String> procesareUitareParola(HttpServletRequest request) {
        String email = request.getParameter("email");
        System.out.println(email);
        String token = RandomStringUtils.randomAlphanumeric(30);

        try {
            if(userRepository.existsByEmail(email)){
                userService.updateResetPasswordToken(token, email);
                sendEmail(email, token);
                return ResponseEntity.ok("Email-ul a fost trimis cu sucess");
            }
            else
                return ResponseEntity.notFound().build();
        } catch (MessagingException | IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private void sendEmail(String recipientEmail, String token)
            throws MessagingException, IOException {
        Email from = new Email(""); //email
        String subject = "Resetare parola cont ManClass";
        Email to = new Email(recipientEmail);
        String mesaj = "Codul tau este: "+token;
        Content content = new Content("text/plain", mesaj);
        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid("");
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sg.api(request);
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody());
        System.out.println(response.getHeaders());
    }
    @GetMapping("/reset-password")
    public ResponseEntity<String> verificareToken(HttpServletRequest request) {
        String token = request.getParameter("token");
        Utilizatori user = userService.getByResetPasswordToken(token);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Token valid");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> processResetPassword(HttpServletRequest request) {
        String token = request.getParameter("token");
        String password = request.getParameter("password");

        Utilizatori user = userService.getByResetPasswordToken(token);

        if (user == null) {
            return ResponseEntity.notFound().build();
        } else {
            userService.updatePassword(user, password);
            return ResponseEntity.ok("Resetarea de parola a fost facuta cu sucess");
        }
    }
}
