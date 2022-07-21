import { Router } from "express";

import * as controller from "../controllers/authController.js";

import { authSchema } from "../schemas/authSchemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(authSchema), controller.signup);

authRouter.post("/signin", validateSchema(authSchema), controller.signin);

export default authRouter;
