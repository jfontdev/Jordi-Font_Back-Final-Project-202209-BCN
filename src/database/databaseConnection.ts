import chalk from "chalk";
import debugCreator from "debug";
import mongoose from "mongoose";

const debug = debugCreator("movierating:database");

const databaseConnection = async (mongoUrl: string) =>
  mongoose
    .connect(mongoUrl, { dbName: "movieRating" })
    .then(() => {
      debug(chalk.green("Connected to the database."));
    })
    .catch((error) => {
      debug(chalk.red("Connection to the database failed"), error);
    });

export default databaseConnection;
