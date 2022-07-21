import { Router } from "express";

import { validateJWT } from "../middlewares/validateJWT";

const testRouter = Router();

testRouter.use(validateJWT);

testRouter.post("/test");
testRouter.get("/test/teacher/:id");
testRouter.get("/test/discipline/:id");

export default testRouter;
