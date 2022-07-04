import dotenv from "dotenv";
import express from "express";
import userController from "../controllers/authController";
import authController from "../controllers/authController";
import { validationMiddleware } from "../middleware/validationMiddleware";
import {
  LoginValidationSchema,
  registrationValidationSchema,
} from "../middleware/validationSchemas";

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
authRouter.post("/google", authController.googleSignInClient);
authRouter.post("/sign-out", userController.logout);
authRouter.get("/refresh", userController.refresh);

export default authRouter;
