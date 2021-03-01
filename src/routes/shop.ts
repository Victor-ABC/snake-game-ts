import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";

const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  const query = `select coins from users where username like "${claimsSet["name"]}";`;
  connection.query(query, (err, resultset) => {
    if (!err) {
      res.render("shop", {
        name: claimsSet["name"].toUpperCase(),
        coins: resultset[0].coins,
      });
    }
  });
});
router.post("/addcoins", (req, res) => {
  console.log(req.body);
  const query = `update users set coins = coins + ${req.body.coins} where username like "${req.body.name}";`;
  connection.query(query, (err, result) => {
    if (!err) {
      res.status(201).send();
    } else {
      console.log(err.message);
    }
  });
});
export default router;
