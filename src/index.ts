import * as dotenv from "dotenv";
import express from "express";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

const { log } = console;

app.use((req, res) => {
  res.status(200).json({ message: "Hola mundo" });
});

app.listen(port, () => {
  log(`Server starting: http://localhost:${port}`);
});
