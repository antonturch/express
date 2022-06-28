import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";

const { validationResult } = require("express-validator");

export const registrationValidationSchema = [
  body(["firstName", "lastName"])
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  body("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
];

export const LoginValidationSchema = [
  body("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
];

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  next();
};
