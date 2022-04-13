import { NextFunction } from "express";
import { Request } from "express-serve-static-core";

const { ApiError } = require("../error-handler");
const { validateAccessToken } = require("../services/userServices");

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("authMiddleware");
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    // @ts-ignore
    const accessToken = req.headers.authorization?.split(" ")[1];
    // console.log("accessToken" + accessToken);
    const googleCookie = req.cookies["connect.sid"];
    console.log(googleCookie);
    if (accessToken !== "null") {
      const userData = validateAccessToken(accessToken);
      // @ts-ignore
      req.user = userData;
      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }
    } else if (accessToken === "null" && !googleCookie) {
      return next(ApiError.UnauthorizedError());
    }
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
};

module.exports = authMiddleware;
