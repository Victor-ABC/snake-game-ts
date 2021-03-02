import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";

const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  let userName: string = claimsSet["name"];
  let query = `select coins from users where username like "${userName}";`;
  connection.query(query, (err, resultset) => {
    if (!err) {
      const coins = resultset[0].coins;
      query = `select i.price, i.itemname, case when ui.username is not null then "gekauft"
      else "nicht gekauft"end as gekauft
       from
       items as i left join (
        select * from users_items where username like "${userName}"
       ) as ui 
       on ui.itemname like i.itemname
       order by i.price;`;
      connection.query(query, (err, resultset) => {
        if (!err) {
          res.render("shop", {
            name: userName,
            coins: coins,
            items: resultset,
          });
        }
      });
    }
  });
});
router.post("/addcoins", (req, res) => {
  const query = `update users set coins = coins + ${req.body.coins} where username like "${req.body.name}";`;
  connection.query(query, (err, result) => {
    if (!err) {
      res.status(201).send();
    } else {
      console.log(err.message);
    }
  });
});
router.post("/buy", (req, res) => {
  let name = req.body.userName;
  let itemName = req.body.itemName;
  let price = req.body.price;
  //1. user coins abziehen
  //2. produkt hinzufügen
  let query = `update users set coins = coins - ${price} where username like "${name}";`;
  connection.query(query, (err, result) => {
    if (!err) {
      query = `insert into users_items(username, itemname) values ("${name}", "${itemName}");`;
      connection.query(query, (err, resultset) => {
        if (!err) {
          res.status(201).end();
        } else {
          console.log("could not insert into users_items");
        }
      });
    } else {
      console.log("von den coins den preis subtrahieren hat nicht geklappt");
    }
  });
});

export default router;
