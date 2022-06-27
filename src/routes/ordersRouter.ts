import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { body, param } from "express-validator";
import { IFullOrder, IOrder, IProduct } from "../db/modelsType";
import { orderService, productService } from "../services";
import { authMiddleware } from "../middleware";
import { OrderRequestParams } from "../types";

interface OrderRequestBody {
  productId: number;
}

const ordersRouter = express.Router();

ordersRouter.get(
  "/:id",
  authMiddleware,
  param("id").toInt(),
  async function (
    req: Request<OrderRequestParams>,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.params.id;

    try {
      const orders: IOrder[] = await orderService.getOrdersByUserId(userId);
      const products: IProduct[] = await productService.getProducts();
      let userOrders: IFullOrder[] = [];

      orders.map((ord) => {
        for (let i = 0; i < products.length; i++) {
          if (products[i].id === ord.ProductId) {
            userOrders = [
              ...userOrders,
              {
                orderId: ord.id,
                productId: products[i].id,
                productName: products[i].name,
                productImg: products[i].img,
                price: products[i].price,
                currency: products[i].currency,
              },
            ];
          }
        }
      });
      res.json(userOrders);
    } catch (e) {
      next(e);
    }
  }
);
ordersRouter.get(
  "/:id/payment",
  authMiddleware,
  param("id").toInt(),
  async function (
    req: Request<OrderRequestParams>,
    res: Response,
    next: NextFunction
  ) {
    const orderId = req.params.id;

    try {
      const order: IOrder = await orderService.getOrderById(orderId);

      res.json(order);
    } catch (e) {
      next(e);
    }
  }
);

ordersRouter.post(
  "/:id",
  authMiddleware,
  body("productId").toInt(),
  param("id").toInt(),
  async function (
    req: Request<OrderRequestParams, any, OrderRequestBody>,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.params.id;
    const productId = req.body.productId;

    try {
      const order = await orderService.addNewOrder(userId, productId);
      const product = await productService.getProductById(
        order.dataValues.ProductId
      );

      res.status(StatusCodes.CREATED).json({
        orderId: order.dataValues.id,
        productId: product.id,
        productName: product.name,
        productImg: product.img,
        price: product.price,
        currency: product.currency,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default ordersRouter;
