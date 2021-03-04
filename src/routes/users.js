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
const express_1 = __importDefault(require("express"));
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const db_1 = require("../db");
const shop_1 = require("./shop");
const cost = 10;
const router = express_1.default.Router();
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", (req, res) => {
    res.clearCookie("jwt-token");
    db_1.con.query(`select * from users where username like "${req.body.name}";`, (err, resultset) => {
        if (!err) {
            if (resultset[0] != undefined) {
                bcrypt.compare(req.body.password, resultset[0].passwort, (err, isValid) => {
                    if (isValid) {
                        let userHighscore = resultset[0].highscore;
                        let claimsSet = {
                            name: `${req.body.name}`,
                            highscore: userHighscore,
                        };
                        let token = jwt.sign(claimsSet, "mysecret", {
                            algorithm: "HS256",
                            expiresIn: "1h",
                        });
                        res.cookie("jwt-token", token);
                        res.redirect("/game");
                    }
                    else {
                        res.redirect("/users/login");
                    }
                });
            }
        }
        else {
            throw new Error("Error while searching user with user and password");
        }
    });
});
router.get("/register", (req, res) => {
    res.render("register");
});
// router.post("/register", (req, res) => {
//   if (req.body.password !== req.body.passwordCheck) {
//     res.redirect("/users/register");
//     return;
//   }
//   let searchUserQuery = `select * from users where username like "${req.body.name}";`;
//   connection.query(searchUserQuery, (err, result) => {
//     if (!err) {
//       if (result[0] == undefined) {
//         bcrypt.genSalt(cost, (err, salt) => {
//           //bcrypt
//           bcrypt.hash(req.body.password, salt, (err, hash) => {
//             if (!err) {
//               let insert = `insert into users(username, passwort, highscore, coins, farbe) values ("${req.body.name}","${hash}", 0 , 0 , "green" );`;
//               connection.query(insert, (err, data) => {
//                 if (!err) {
//                   res.redirect("/users/login");
//                 } else {
//                   console.log("fehler beim einfügen des neuen users");
//                 }
//               });
//             }
//           });
//         });
//       } else {
//         res.redirect("users/register?err=nameAlreadyExists"); // user bereits vorhanden
//       }
//     } else {
//       console.log("Error during search of user");
//     }
//   });
// });
router.post("/register", (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
        res.redirect("/users/register");
        return;
    }
    shop_1.queryPromise(`select * from users where username like "${req.body.name}";`, db_1.con)
        .then((result) => {
        if (result[0] == undefined) {
            bcrypt.genSalt(cost, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (!err) {
                        // let insert = `insert into users(username, passwort, highscore, coins, farbe) values ("${req.body.name}","${hash}", 0 , 0 , "green" );`;
                        // connection.query(insert, (err, data) => {
                        //   if (!err) {
                        //     res.redirect("/users/login");
                        //   } else {
                        //     console.log("fehler beim einfügen des neuen users");
                        //   }
                        // });
                        return shop_1.queryPromise(` insert into users(username, passwort, highscore, coins, farbe) values ("${req.body.name}","${hash}", 0 , 0 , "green" );`, db_1.con);
                    }
                });
            });
        }
        else {
            console.log("user altready exists");
        }
    })
        .then(() => {
        res.redirect("/users/login");
    })
        .catch((err) => {
        console.log(err);
    });
});
router.delete("/signout", (req, res) => {
    res.clearCookie("jwt-token");
    res.status(200).end();
});
exports.default = router;
