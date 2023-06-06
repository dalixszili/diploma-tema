import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import userRoute from "./routes/UserRoutes.js";
import sponsorsRoute from "./routes/SponsorsRoutes.js";
import categoriesRoute from "./routes/CategoryRoutes.js";
import teachersRoute from "./routes/TeacherRoutes.js";
import authorsRoute from "./routes/AuthorRoutes.js";
import projectsRoute from "./routes/ProjectRoutes.js";
import settingsRoute from "./routes/SettingRoutes.js";
import pagesRoute from "./routes/PageRoutes.js";
import menusRoute from "./routes/MenuRoutes.js";
import db from "./config/Database.js";

dotenv.config();
const app = express();

// (async () => {
//   await db.sync({ alter: true });
// })();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.static("public"));
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
app.use(userRoute);
app.use(sponsorsRoute);
app.use(categoriesRoute);
app.use(teachersRoute);
app.use(authorsRoute);
app.use(projectsRoute);
app.use(settingsRoute);
app.use(menusRoute);
app.use(pagesRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(" The Server is running ...");
});
