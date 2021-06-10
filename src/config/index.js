import dotenv from "dotenv";
dotenv.config();

const { DB_USERNAME, DB_PASSWORD, DB_ENDPOINT, DB_NAME, PORT ,SECRET_JWT } = process.env;
export const config = {
  db_username: DB_USERNAME,
  db_password: DB_PASSWORD,
  db_endpoint: DB_ENDPOINT,
  db_name: DB_NAME,
  port: PORT,
  secret_jwt:SECRET_JWT
};
