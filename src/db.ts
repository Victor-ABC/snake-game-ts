import mysql from "mysql";

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "a345snake",
  insecureAuth: true,
  database: "snakeGame",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database");
  console.log("----------------------");
});

export { con }; //funktioniert sehr gut
