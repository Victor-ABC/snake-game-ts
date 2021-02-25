import express, { Express } from "express";
import { con as connection } from "./db";
import * as path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

let port = 3000;

function startApp() {
  let app: Express = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.send();
  });

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

startApp();

connection.query("select * from users", (err, result) => {
  if (err) throw err;
  else {
    console.log(result[0].name);
  }
});
connection.end();
