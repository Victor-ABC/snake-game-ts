import express, { Express } from "express";
import exphbs from "express-handlebars";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";
import gameRouter from "./routes/game";

const port = 3000;

const app: Express = express();
const engineConfig = {
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
  defaultLayout: "main",
};
app.engine("hbs", exphbs(engineConfig));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.redirect("/users/register");
});
app.use("/users", userRouter);
app.use((req, res, next) => {
  // token verify
  const token = req.cookies["jwt-token"] || "";
  try {
    res.locals.user = jwt.verify(token, "mysecret");
    next();
  } catch (error) {
    res.redirect("/users/register");
  }
});
app.use("/game", gameRouter);
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
