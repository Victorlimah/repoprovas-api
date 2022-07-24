import { Router } from "express";

import { validateJWT } from "../middlewares/validateJWT.js";
import * as controller from "../controllers/testController.js";

import { testSchema } from "../schemas/testSchema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const testRouter = Router();

testRouter.use(validateJWT);

testRouter.post("/test", validateSchema(testSchema), controller.create);
testRouter.get("/test/teacher/:id", controller.getByTeacher);
testRouter.get("/test/discipline/:id");

export default testRouter;
