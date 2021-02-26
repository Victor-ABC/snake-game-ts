import express, { Express } from "express";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";
import gameRouter from "./routes/game";
let port = 3000;

let app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", userRouter);
app.use((req, res, next) => {
  // token verify
  const token = req.cookies["jwt-token"] || "";
  try {
    res.locals.user = jwt.verify(token, "mysecret");
    next();
  } catch (error) {
    res.redirect("/users/login");
  }
});
app.use("/game", gameRouter);
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
