import app from "./src/app.js";

app.listen(process.env.APP_PORT, () => {
  console.log(` The Server is running on PORT : ${process.env.APP_PORT}`);
});
