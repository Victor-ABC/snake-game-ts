import express from "express";
import * as jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  let claimsSet: any = jwt.verify(req.cookies["jwt-token"], "mysecret");
  res.render("game", { highscore: claimsSet["highscore"] });
});

export default router;
