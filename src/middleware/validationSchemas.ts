import { body, param } from "express-validator";

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

export const GetOrderParamsValidationSchema = [param("id").toInt()];
export const GetOrderBodyValidationSchema = [body("productId").toInt()];
