import environment from "../loadEnvironment.js";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import usersRouter from "./routes/usersRouter.js";
import stringToArray from "../utils/stringToArray/stringToArray.js";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";
import reviewsRouter from "./routes/reviewsRouter.js";

const { corsAllowedDomains } = environment;

const app = express();

app.disable("x-powered-by");

const allowedOrigins = stringToArray(corsAllowedDomains, ",");

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(express.json());

app.use(morgan("dev"));

app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);

app.use(generalError);
app.use(unknownEndpoint);

export default app;
