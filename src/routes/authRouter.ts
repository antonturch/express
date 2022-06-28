import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import userController from "../controllers/userController";
import {
  LoginValidationSchema,
  registrationValidationSchema,
  validationMiddleware,
} from "../middleware/validationMiddleware";

dotenv.config();

const authRouter = express.Router();

authRouter.post(
  "/sign-up",
  registrationValidationSchema,
  validationMiddleware,
  userController.registration
);
authRouter.post(
  "/sign-in",
  LoginValidationSchema,
  validationMiddleware,
  userController.login
);
authRouter.post("/sign-out", userController.logout);
authRouter.get("/refresh", userController.refresh);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  // @ts-ignore
  userController.googleAuthRedirect
);

export default authRouter;
