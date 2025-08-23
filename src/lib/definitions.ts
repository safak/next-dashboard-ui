export type User = {
  id: string;            // ou number si MySQL AUTO_INCREMENT
  name: string;
  surname: string;
  email: string;
  password: string;      // hashé avec bcrypt
  role?: string;         // "admin", "teacher", "student", etc. (facultatif)
  created_at?: Date;
  updated_at?: Date;
};
