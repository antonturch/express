import express from "express";
import { authMiddleware } from "../middleware";
import ordersController from "../controllers/ordersController";
import {
  GetOrderBodyValidationSchema,
  GetOrderParamsValidationSchema,
} from "../middleware/validationSchemas";
import { validationMiddleware } from "../middleware/validationMiddleware";

const ordersRouter = express.Router();

ordersRouter.get(
  "/:id",
  authMiddleware,
  GetOrderParamsValidationSchema,
  validationMiddleware,
  ordersController.getOrdersByUserId
);
ordersRouter.get(
  "/:id/payment",
  authMiddleware,
  GetOrderParamsValidationSchema,
  validationMiddleware,
  ordersController.getOrderById
);

ordersRouter.post(
  "/:id",
  authMiddleware,
  GetOrderParamsValidationSchema,
  GetOrderBodyValidationSchema,
  validationMiddleware,
  ordersController.createNewOrder
);

export default ordersRouter;
