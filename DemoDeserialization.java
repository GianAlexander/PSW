import java.io.*;

public class DemoDeserialization {
    public static void main(String[] args) {
        try {
            // Serialización de objetos de usuarios de ejemplo
            serializeObjects();

            // Deserialización de los objetos
            deserializeObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Método para serializar objetos de usuarios de ejemplo
    private static void serializeObjects() throws IOException {
        // Creamos objetos de ejemplo de diferentes usuarios con roles
        User admin = new User("admin", "admin_password", "admin");
        User user1 = new User("user1", "user1_password", "regular_user");
        User user2 = new User("user2", "user2_password", "regular_user");

        // Escribimos los objetos en archivos
        serializeUser(admin, "admin.ser");
        serializeUser(user1, "user1.ser");
        serializeUser(user2, "user2.ser");

        System.out.println("Objetos de usuario serializados correctamente.");
    }

    // Método para serializar un objeto de usuario en un archivo
    private static void serializeUser(User user, String filename) throws IOException {
        FileOutputStream fileOut = new FileOutputStream(filename);
        ObjectOutputStream out = new ObjectOutputStream(fileOut);
        out.writeObject(user);
        out.close();
        fileOut.close();
    }

    // Método para deserializar un objeto de usuario
    private static void deserializeObject() throws IOException, ClassNotFoundException {
        // Aquí puedes realizar la deserialización maliciosa de un usuario específico
        // Por ejemplo, intentar deserializar el usuario "admin" maliciosamente
        deserializeUser("admin.ser");
    }

    // Método para deserializar un objeto de usuario desde un archivo
    private static void deserializeUser(String filename) throws IOException, ClassNotFoundException {
        FileInputStream fileIn = new FileInputStream(filename);
        ObjectInputStream in = new ObjectInputStream(fileIn);
        User user = (User) in.readObject();
        in.close();
        fileIn.close();

        // Imprimir los detalles del usuario deserializado
        System.out.println("Objeto de usuario deserializado desde " + filename + ":");
        System.out.println("Nombre de usuario: " + user.getUsername());
        System.out.println("Contraseña: " + user.getPassword());
        System.out.println("Rol: " + user.getRole());
    }
}

// Clase de ejemplo para la serialización de usuarios
class User implements Serializable {
    private String username;
    private String password;
    private String role;

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}
