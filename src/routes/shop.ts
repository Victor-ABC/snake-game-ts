import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";
import mysql from "mysql";

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
  //1. prüfen ob bereits gekauft
  //1.1 Preis des Items holen
  //2. produkt ob genug geld (priceItem <= geldUser)
  //3. Kaufen
  //4. Coins um summe verringern
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  let userName: string = claimsSet["name"];
  let itemName: string = req.body.itemName;

  let price: number;
  queryPromise(
    `select * from users_items where username like "${userName}" and itemname like "${itemName}";`,
    connection
  )
    .then((result) => {
      if (result[0] === undefined) {
        return queryPromise(
          `select price from items where items.itemname like "${itemName}";`,
          connection
        );
      } else {
        throw new Error(`user ${userName} already bought ${itemName}`);
      }
    })
    .then((result) => {
      if (result) {
        price = result[0].price;
        return queryPromise(
          `select coins from users where username like "${userName}";`,
          connection
        );
      } else {
        throw new Error(`could not find price for ${itemName}`);
      }
    })
    .then((result) => {
      if (result) {
        let coins: number = result[0].coins;
        if (coins >= price) {
          return queryPromise(
            `insert into users_items(username, itemname)
             values
            ("${userName}" , "${itemName}");`,
            connection
          );
        } else {
          throw new Error(
            `User(coins = ${coins}) does not have enough money for ${itemName}: price = ${price}`
          );
        }
      } else {
        throw new Error(`could not find price for ${itemName}`);
      }
    })
    .then((result) => {
      return queryPromise(
        `update users 
        set coins = coins - ${price} 
        where username like "${userName}";`,
        connection
      );
    })
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

export function queryPromise(
  query: string,
  connection: mysql.Connection
): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    connection.query(query, (err, resultset) => {
      if (!err) {
        resolve(resultset);
      } else {
        reject(err);
      }
    });
  });
}

export default router;
