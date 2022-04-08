import { NextFunction } from "express";

const ApiError = require("../error-handler");
const { validateAccessToken } = require("../services/userServices");

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("authMiddleware");
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    // @ts-ignore
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = validateAccessToken(accessToken);
    if (userData){
      return next(ApiError.UnauthorizedError());
    }
    // @ts-ignore
    req.user = userData;
    console.log(userData);
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
};

module.exports = authMiddleware;
