import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function decryptPassword(password: string, encryptedPassword: string) {
  return bcrypt.compareSync(password, encryptedPassword);
}
