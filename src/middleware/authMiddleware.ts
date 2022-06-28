import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userServices from "../services/usersService";
import { UnauthorizedError } from "../error-handler/custom-errors";
import { OrderRequestParams } from "../types";
import { IUser } from "../db/modelsType";

dotenv.config();

interface AuthMiddlewareRequest extends OrderRequestParams {
  user: IUser;
}

export default function authMiddleware(
  req: Request<AuthMiddlewareRequest>,
  res: Response,
  next: NextFunction
) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const googleToken = req.cookies["jwt"];
    const refreshToken = req.cookies["refreshToken"];
    if (refreshToken && accessToken && accessToken !== "null") {
      const userData = userServices.validateAccessToken(accessToken);
      req.user = userData as IUser;
      if (!userData) {
        return next(
          new UnauthorizedError({ message: `User doesn't authorized` })
        );
      }
    } else if (googleToken) {
      const userFromGoogle = jwt.verify(
        googleToken,
        process.env.JWT_ACCESS_SECRET as string
      );
      if (!userFromGoogle) {
        return next(
          new UnauthorizedError({ message: `User doesn't authorized` })
        );
      }
    } else if (accessToken === "null") {
      return next(
        new UnauthorizedError({ message: `User doesn't authorized` })
      );
    }
    next();
  } catch (e: any) {
    next(
      new UnauthorizedError({
        message: `User doesn't authorized (${e.message})`,
      })
    );
  }
}
