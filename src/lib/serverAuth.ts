import bcrypt from "bcryptjs";
import { dbConnection } from "./mysql";


export async function authenticateServer(email: string, password: string) {
  const [rows] = await dbConnection.query("SELECT * FROM user WHERE email = ? LIMIT 1", [email]);
  const user = (rows as any[])[0];
  if (!user) return { success: false, error: "Utilisateur non trouvé" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { success: false, error: "Mot de passe incorrect" };

  return { success: true, user: { id: user.id, email: user.email, name: user.name } };
}
