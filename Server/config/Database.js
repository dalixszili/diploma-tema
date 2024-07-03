import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast: true,
    },
    timezone: "Europe/Bucharest",
  }
);

export default db;
