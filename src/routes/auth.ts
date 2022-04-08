import express from "express";

const {
  registration,
  login,
  logout,
  refresh,
} = require("../controllers/userController");
const authRouter = express.Router();

authRouter.post("/sign-up", registration);

authRouter.post("/sign-in", login);
authRouter.post("/sign-out", logout);
authRouter.get("/refresh", refresh);

module.exports = authRouter;
