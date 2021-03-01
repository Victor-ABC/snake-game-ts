import express from "express";
import * as fs from "fs";
import * as path from "path";

const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile(
    path.join(__dirname, "..", "public/game.html"),
    "utf-8",
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.send(err);
      }
    }
  );
});

export default router;
