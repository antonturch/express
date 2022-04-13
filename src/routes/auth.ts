import express from "express";

const { registrationUser } = require("../services/userServices");
const {
  registration,
  login,
  logout,
  googleLogout,
  refresh,
  googleAuthInitialization,
  googleAuthRedirect,
  googleAuthFailure,
} = require("../controllers/userController");
const passport = require("passport");

const authRouter = express.Router();
googleAuthInitialization();

authRouter.post("/sign-up", registration);
authRouter.post("/sign-in", login);
authRouter.post("/sign-out", logout);
authRouter.get("/sign-out-google", googleLogout);
authRouter.get("/refresh", refresh);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
authRouter.get("/google/callback", googleAuthRedirect);
authRouter.get("/failure", googleAuthFailure);

authRouter.get(
  "/gg",
  // googleRegistration
  passport.authenticate("google", { session: false }),
  async (req, res) => {
      // @ts-ignore
      const {given_name, family_name, email} = req.user;
      const userData = await registrationUser(
          given_name,
          family_name,
          email,
          "password"
      );
      res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
      });
      res.json(userData);
      res.redirect("http://localhost:3000/products");
  }
);

module.exports = authRouter;
