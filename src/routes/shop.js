"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPromise = void 0;
const express_1 = __importDefault(require("express"));
const jwt = __importStar(require("jsonwebtoken"));
const db_1 = require("../db");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    let claimsSet = jwt.verify(req.cookies["jwt-token"], "mysecret");
    let userName = claimsSet["name"];
    let query = `select coins from users where username like "${userName}";`;
    db_1.con.query(query, (err, resultset) => {
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
            db_1.con.query(query, (err, resultset) => {
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
    db_1.con.query(query, (err, result) => {
        if (!err) {
            res.status(201).send();
        }
        else {
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
    let claimsSet = jwt.verify(req.cookies["jwt-token"], "mysecret");
    let userName = claimsSet["name"];
    let itemName = req.body.itemName;
    let price;
    queryPromise(`select * from users_items where username like "${userName}" and itemname like "${itemName}";`, db_1.con)
        .then((result) => {
        if (result[0] === undefined) {
            return queryPromise(`select price from items where items.itemname like "${itemName}";`, db_1.con);
        }
        else {
            throw new Error(`user ${userName} already bought ${itemName}`);
        }
    })
        .then((result) => {
        if (result) {
            price = result[0].price;
            return queryPromise(`select coins from users where username like "${userName}";`, db_1.con);
        }
        else {
            throw new Error(`could not find price for ${itemName}`);
        }
    })
        .then((result) => {
        if (result) {
            let coins = result[0].coins;
            if (coins >= price) {
                return queryPromise(`insert into users_items(username, itemname)
             values
            ("${userName}" , "${itemName}");`, db_1.con);
            }
            else {
                throw new Error(`User(coins = ${coins}) does not have enough money for ${itemName}: price = ${price}`);
            }
        }
        else {
            throw new Error(`could not find price for ${itemName}`);
        }
    })
        .then((result) => {
        return queryPromise(`update users 
        set coins = coins - ${price} 
        where username like "${userName}";`, db_1.con);
    })
        .then(() => {
        res.status(201).send();
    })
        .catch((err) => {
        console.log(err);
    });
});
function queryPromise(query, connection) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, resultset) => {
            if (!err) {
                resolve(resultset);
            }
            else {
                reject(err);
            }
        });
    });
}
exports.queryPromise = queryPromise;
exports.default = router;
