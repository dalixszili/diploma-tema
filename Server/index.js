import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoutes.js";
import db from "./config/Database.js";

dotenv.config();
const app = express();

(async () => {
  await db.sync();
})();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);
app.use(UserRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(" The Server is running ...");
});

//https://mfikri.com/en/blog/react-express-mysql-authentication
