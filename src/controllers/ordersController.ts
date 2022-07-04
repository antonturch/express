import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { OrderRequestParams } from "../types";
import { IFullOrder, IOrder, IProduct } from "../db/modelsType";
import { orderService, productService } from "../services";
import { OrderRequestBody } from "../middleware/authMiddleware";

interface CreateOrderBodyRequest extends OrderRequestBody {
  productId: number;
}

const getOrdersByUserId = async (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.user.id;

  try {
    const orders: IOrder[] = await orderService.getOrdersByUserId(userId);
    const products = await productService.getProductsForOrderList(orders);
    let userOrders: IFullOrder[] = [];

    orders.map((ord) => {
      const product = products.find(({ id }) => id === ord.ProductId);
      if (!product) {
        return;
      }
      userOrders = [
        ...userOrders,
        {
          orderId: ord.id,
          productId: product.id,
          productName: product.name,
          productImg: product.img,
          price: product.price,
          currency: product.currency,
        },
      ];
    });

    res.json(userOrders);
  } catch (e) {
    next(e);
  }
};

const getOrderById = async (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.body.user.id;

  try {
    const order: IOrder = await orderService.getOrderById(orderId);

    res.json(order);
  } catch (e) {
    next(e);
  }
};

const createNewOrder = async (
  req: Request<OrderRequestParams, any, CreateOrderBodyRequest>,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.user.id;
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
};

export default {
  getOrdersByUserId,
  getOrderById,
  createNewOrder,
};
