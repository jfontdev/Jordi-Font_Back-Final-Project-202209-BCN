import environment from "./loadEnvironment.js";
import databaseConnection from "./database/databaseConnection.js";
import serverStart from "./server/serverStart.js";

const { port, mongoUrl } = environment;

await databaseConnection(mongoUrl);
await serverStart(+port);
