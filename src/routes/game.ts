import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";

const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  connection.query(
    "select username as name, highscore as score from users order by highscore desc limit 10;",
    (err, resultsetScoreboard) => {
      if (!err) {
        connection.query(
          `select highscore from users where username like "${claimsSet["name"]}";`,
          (err, resultSetHighscore) => {
            if (!err) {
              res.render("game", {
                highscore: resultSetHighscore[0].highscore,
                player: claimsSet["name"],
                champion: resultsetScoreboard,
              });
            }
          }
        );
      }
    }
  );
});
router.post("/", (req, res) => {
  connection.query(
    `update users set highscore=${req.body.highscore} where username like "${req.body.name}";`,
    (err, data) => {
      if (!err) {
        res.status(201).send();
      } else {
      }
    }
  );
});

export default router;
