import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ParamsDictionary } from "express-serve-static-core";
import tokenService from "../services/tokenService";
import { UnauthorizedError } from "../error-handler/custom-errors";
import { IUser } from "../db/modelsType";

dotenv.config();

export interface OrderRequestBody {
  user: IUser;
}

export default function authMiddleware(
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const googleToken = req.cookies["jwt"];
    if (accessToken && accessToken !== "null") {
      const userData = tokenService.validateAccessToken(accessToken);
      req.body.user = userData as IUser;
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
