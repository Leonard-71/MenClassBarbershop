package MenClass.demo.utils;

import java.util.Base64;

public class Utils {
    public static byte[] decodeBase64(String base64String) {
        return Base64.getDecoder().decode(base64String);
    }

    public static String encodeBase64(byte[] byteArray) {
        return Base64.getEncoder().encodeToString(byteArray);
    }
}
