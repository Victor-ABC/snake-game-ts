import express from "express";
// import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  res.clearCookie("jwt-token");

  let searchQuery = `select * from users where username like "${req.body.name}" AND passwort like "${req.body.password}";`;
  connection.query(searchQuery, (err, data) => {
    if (!err) {
      if (data[0] != undefined) {
        let userHighscore = data[0].highscore;
        let claimsSet = {
          iat: 1475232583813,
          name: `${req.body.name}`,
          highscore: userHighscore,
        };
        let token = jwt.sign(claimsSet, "mysecret", {
          algorithm: "HS256",
          expiresIn: "1h",
        });
        res.cookie("jwt-token", token);
        res.redirect("/game");
      } else {
        res.redirect("/users/login");
      }
    } else {
      throw new Error("Error while searching user with user and password");
    }
  });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  if (req.body.password !== req.body.passwordCheck) {
    res.redirect("/users/register");
    return;
  }
  let searchUserQuery = `select * from users where username like "${req.body.name}";`;
  connection.query(searchUserQuery, (err, result) => {
    if (!err) {
      if (result[0] == undefined) {
        let insert = `insert into users(username, passwort, highscore) values ("${req.body.name}","${req.body.password}",0);`;
        connection.query(insert, (err, data) => {
          if (!err) {
            res.redirect("/users/login");
          } else {
            console.log("fehler beim einfügen des neuen users");
          }
        });
      } else {
        res.redirect("users/register?err=nameAlreadyExists"); // user bereits vorhanden
      }
    } else {
      console.log("Error during search of user");
    }
  });
});

router.delete("/signout", (req, res) => {
  res.clearCookie("jwt-token");
  res.status(200).end();
});

export default router;
