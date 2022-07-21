import { Router } from "express";

import * as controller from "../controllers/authController.js";

import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const authRouter = Router();

authRouter.post("/signin", validateSchema(loginSchema), controller.signin);
authRouter.post("/signup", validateSchema(registerSchema), controller.signup);

export default authRouter;
