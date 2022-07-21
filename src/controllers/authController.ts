import { Request, Response } from "express";

import * as service from "../services/userService.js";

export async function signup(req: Request, res: Response) {
  await service.create(req.body);
  res.sendStatus(201);
}

export async function signin(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await service.login({ email, password });
  res.send(user);
}
