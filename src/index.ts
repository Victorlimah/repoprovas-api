import express, { json } from "express";
import "express-async-errors";

import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
dotenv.config();

app.use(json());
app.use(cors());

app.use(router);
app.use(errorHandler);

export default app;