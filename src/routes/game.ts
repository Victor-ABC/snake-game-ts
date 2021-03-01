import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";

const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  res.render("game", {
    highscore: claimsSet["highscore"],
    player: claimsSet["name"],
  });
});
router.post("/", (req, res) => {
  connection.query(
    `update users set highscore=${req.body.highscore} where username like "${req.body.name}";`,
    (err, data) => {
      if (!err) {
        console.log(
          `User: ${req.body.name} has a new highscore(${req.body.highscore})`
        );
        res.status(201).send();
      } else {
        console.log(
          `Error, User: ${req.body.name} with new highscore(${req.body.highscore}) coult not been updated`
        );
      }
    }
  );
});

export default router;
