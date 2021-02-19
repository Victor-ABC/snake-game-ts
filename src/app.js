const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

let port = 3000;
let app = express();



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