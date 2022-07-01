import { NextFunction, Request, Response } from "express";
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
    console.log(accessToken);
    if (accessToken && accessToken !== "null") {
      const userData = tokenService.validateAccessToken(accessToken);

      if (!userData) {
        return next(
          new UnauthorizedError({ message: `User doesn't authorized` })
        );
      }
      req.body.user = userData as IUser;
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
