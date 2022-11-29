import * as dotenv from "dotenv";
dotenv.config();

const environment = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  secretKey: process.env.SECRET_KEY,
  corsAllowedDomains: process.env.CORS_ALLOWED_DOMAINS,
};

export default environment;
