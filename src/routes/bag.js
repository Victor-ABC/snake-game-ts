import express from "express";
import * as jwt from "jsonwebtoken";
import { con as connection } from "../db";
const router = express.Router();
router.get("/", (req, res) => {
    let claimsSet = jwt.verify(req.cookies["jwt-token"], "mysecret");
    let userName = claimsSet["name"];
    connection.query(`select itemname as item from users_items where username like "${userName}";`, (err, resultset) => {
        if (!err) {
            res.render("bag", { items: resultset, username: userName });
        }
        else {
            res.status(404).end();
        }
    });
});
export default router;
