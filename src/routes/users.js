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
const cost = 10;
const router = express_1.default.Router();
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", (req, res) => {
    res.clearCookie("jwt-token");
    db_1.con.query(`select * from users where username like "${req.body.name}";`, (err, data) => {
        if (!err) {
            if (data[0] != undefined) {
                console.log(req.body.password);
                console.log(data[0].passwort);
                bcrypt.compare(req.body.password, data[0].passwort, (err, isValid) => {
                    if (isValid) {
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
router.post("/register", (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
        res.redirect("/users/register");
        return;
    }
    let searchUserQuery = `select * from users where username like "${req.body.name}";`;
    db_1.con.query(searchUserQuery, (err, result) => {
        if (!err) {
            if (result[0] == undefined) {
                bcrypt.genSalt(cost, (err, salt) => {
                    //bcrypt
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (!err) {
                            console.log(hash);
                            let insert = `insert into users(username, passwort, highscore) values ("${req.body.name}","${hash}",0);`;
                            db_1.con.query(insert, (err, data) => {
                                if (!err) {
                                    res.redirect("/users/login");
                                }
                                else {
                                    console.log("fehler beim einfügen des neuen users");
                                }
                            });
                        }
                    });
                });
            }
            else {
                res.redirect("users/register?err=nameAlreadyExists"); // user bereits vorhanden
            }
        }
        else {
            console.log("Error during search of user");
        }
    });
});
router.delete("/signout", (req, res) => {
    res.clearCookie("jwt-token");
    res.status(200).end();
});
exports.default = router;
