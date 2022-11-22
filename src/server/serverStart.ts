import chalk from "chalk";
import debugCreator from "debug";
import app from "./app.js";

const debug = debugCreator("movierating:server");

const serverStart = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server starting at http://localhost:${port}`));
      resolve(true);
    });

    server.on("error", (error) => {
      debug(chalk.red("Error connecting to the database: ", error.message));
      reject(error);
    });
  });

export default serverStart;
