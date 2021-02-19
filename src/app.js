"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");
const bodyParser = require("body-parser");
let port = 3000;
let app = express_1.default();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express_1.default.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.send();
});
function startServer() {
    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
}
;
startServer();
