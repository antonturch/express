import express from "express";
import { authMiddleware } from "../middleware";
import ordersController from "../controllers/ordersController";
import {
  GetOrderBodyValidationSchema,
  GetItemByIdInParamsValidationSchema,
} from "../middleware/validationSchemas";
import { validationMiddleware } from "../middleware/validationMiddleware";

const ordersRouter = express.Router();

ordersRouter.get(
  "/:id",
  authMiddleware,
  GetItemByIdInParamsValidationSchema,
  validationMiddleware,
  ordersController.getOrdersByUserId
);
ordersRouter.get(
  "/:id/payment",
  authMiddleware,
  GetItemByIdInParamsValidationSchema,
  validationMiddleware,
  ordersController.getOrderById
);

ordersRouter.post(
  "/:id",
  authMiddleware,
  GetItemByIdInParamsValidationSchema,
  GetOrderBodyValidationSchema,
  validationMiddleware,
  ordersController.createNewOrder
);

export default ordersRouter;
