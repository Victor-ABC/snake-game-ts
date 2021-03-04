import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";
import { queryPromise } from "./shop";
const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  let name = claimsSet["name"];
  let champion: string | null;
  let items: string[];
  queryPromise(
    `select itemname as item from users_items where username like "${name}";
  `,
    connection
  )
    .then((result) => {
      if (result) {
        items = result;
        return queryPromise(
          `select username as name, highscore as score from users order by highscore desc limit 10;`,
          connection
        );
      } else {
        console.log("coult not load items of user");
      }
    })
    .then((result) => {
      if (result) {
        champion = result;
        return queryPromise(
          `select highscore , farbe from users where username like "${name}";`,
          connection
        );
      } else {
        throw new Error("could not lead scorebord (GlobalScores) ");
      }
    })
    .then((result) => {
      if (result) {
        res.render("game", {
          highscore: result[0].highscore,
          player: name,
          champion: champion,
          farbe: result[0].farbe,
          items: items,
        });
      } else {
        throw new Error("could not load highscore");
      }
    });
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
