import { NextFunction, Request, Response } from "express";

const { ApiError } = require("../error-handler/index");

module.exports = function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Unexpected error" });
};
