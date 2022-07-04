import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const { validationResult } = require("express-validator");

export const validationMiddleware = <T>(
  req: Request<T>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  next();
};
