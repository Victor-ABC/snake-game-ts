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
const jwt = __importStar(require("jsonwebtoken"));
const db_1 = require("../db");
const shop_1 = require("./shop");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    let claimsSet = jwt.verify(req.cookies["jwt-token"], "mysecret");
    let userName = claimsSet["name"];
    db_1.con.query(`select itemname as item from users_items where username like "${userName}";`, (err, resultset) => {
        if (!err) {
            res.render("bag", { items: resultset, username: userName });
        }
        else {
            res.status(404).end();
        }
    });
});
router.post("/color", (req, res) => {
    console.log("post at /color");
    shop_1.queryPromise(`select itemname as item from items;`, db_1.con).then((result) => {
        console.log(req.body);
        res.redirect("/bag");
    });
});
exports.default = router;
