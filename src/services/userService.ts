import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

import * as repository from "../repositories/userRepository.js";
import * as passUtils from "../../../driven-pass-api/src/utils/passUtils.js";

export type userType = Omit<User, "id" | "createdAt">;

export async function create(user: userType) {
  const userExists = await repository.search("email", user.email);
  if (userExists) throw { type: "conflict", message: "User already exists" };

  const hashedPass = passUtils.encryptPassword(user.password);
  
  const newUser = { email: user.email, password: hashedPass };
  await repository.create(newUser);

}

export async function login(user: userType) {
  const userExists = await repository.search("email", user.email);
  
  if (!userExists)
  throw { type: "unauthorized", message: "Invalid credentials. Try again." };
  
  const isValid = passUtils.decryptPassword(user.password, userExists.password);
  if (!isValid)
  throw { type: "unauthorized", message: "Invalid credentials. Try again." };

  const data = { id: userExists.id, email: userExists.email };
  const token = jwt.sign(data, process.env.JWT_SECRET);

  return { token };
}
