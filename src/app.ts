import express , { Express as ExpressType} from "express"; 
import {con} from "./db";

// const path = require("path");
// const bodyParser = require("body-parser");
import * as path from "path";
import bodyParser from 'body-parser';

let port = 3000;
let app : ExpressType = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send();
});


function startServer() {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();

con.query("select * from users", function (err, result) {
  if (err) throw err;
  else {
    console.log(result[0].name);
  }
});