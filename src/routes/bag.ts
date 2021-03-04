import express, { json } from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";
import { queryPromise } from "./shop";

const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  let userName: string = claimsSet["name"];
  connection.query(
    `select itemname as item from users_items where username like "${userName}";`,
    (err, resultset) => {
      if (!err) {
        res.render("bag", { items: resultset, username: userName });
      } else {
        res.status(404).end();
      }
    }
  );
});
router.post("/color", (req, res) => {
  console.log("post at /color");
  queryPromise(`select itemname as item from items;`, connection).then(
    (result) => {
      console.log(req.body);
      res.redirect("/bag");
    }
  );
});

export default router;
