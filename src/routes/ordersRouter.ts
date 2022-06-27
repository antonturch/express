import express, { NextFunction, Request, Response } from "express";
import { IFullOrder, IOrder, IProduct } from "../db/modelsType";
import { orderService, productService } from "../services";
import { authMiddleware } from "../middleware";

const ordersRouter = express.Router();

ordersRouter.get(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id);
    try {
      const ordersList: IOrder[] = await orderService.getOrdersByUserId(userId);
      const products: IProduct[] = await productService.getProducts();
      let userOrders: IFullOrder[] = [];
      ordersList.map((ord) => {
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
  },
  authMiddleware
);
ordersRouter.get(
  "/:id/payment",
  async function (req: Request, res: Response, next: NextFunction) {
    const orderId = Number(req.params.id);
    try {
      const order: IOrder = await orderService.getOrderById(orderId);
      res.json(order);
    } catch (e) {
      next(e);
    }
  },
  authMiddleware
);

ordersRouter.post(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id);
    const productId = Number(req.body.productId);
    try {
      const order = await orderService.addNewOrder(userId, productId);
      const product = await productService.getProductById(
        order.dataValues.ProductId
      );
      res.status(201).json({
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
  },
  authMiddleware
);

export default ordersRouter;
