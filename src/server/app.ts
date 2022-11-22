import express from "express";
import morgan from "morgan";
import { generalError, unknownEndpoint } from "./middlewares/errors";
import usersRouter from "./routes/usersRouter";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use(morgan("dev"));

app.use("/users", usersRouter);

app.use(generalError);
app.use(unknownEndpoint);

export default app;
