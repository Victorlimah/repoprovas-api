import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export async function validateJWT(req: Request, res: Response, next: NextFunction) {
  let token = req.headers["authorization"];
  if (!token) throw { type: "unauthorized", message: "No token provided." };

  token = token.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  res.locals.user = decoded;
  next();  
}