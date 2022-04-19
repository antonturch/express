import express, { NextFunction, Request, Response } from "express";
import { IOrder } from "../db/modelsType";
import { orderService } from "../services";

const ordersRouter = express.Router();

ordersRouter.get(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id);
    try {
      const ordersList: IOrder = await orderService.getOrdersByUserId(userId);
      res.json(ordersList);
    } catch (e) {
      next(e);
    }
  }
);

ordersRouter.post(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id);
    const productId = Number(req.body.productId);
    try {
      const order = await orderService.addNewOrder(userId, productId);
      res.status(201).json(order.dataValues);
    } catch (e) {
      next(e);
    }
  }
);

export default ordersRouter;
