import { Request, Response, NextFunction } from "express";

const ErrorModel = require("./index");

module.exports = function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Error handling middleware called.");
  console.log("Path:", req.path);
  console.error("Error occurred:", err);
  if (err instanceof ErrorException) {
    console.log("Error is known.");
    // @ts-ignore
    res.status(err.status).send(err);
  } else {
    // For unhandled errors.
    res
      .status(500)
      .send({ code: ErrorCode.UnknownError, status: 500 } as typeof ErrorModel);
  }
};
