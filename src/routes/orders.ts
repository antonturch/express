import express from "express";
import { OrderAttributes } from "../db/modelsType";

const { orderService } = require("../services");

const ordersRouter = express.Router();

ordersRouter.use((req, res, next) => {
  console.log("Request order router");
  next();
});

ordersRouter.get("/:id", async function (req, res) {
  const UserId = Number(req.params.id);
  try {
    const ordersList: OrderAttributes = await orderService.getOrderByUserId(
      UserId
    );
    res.json(ordersList);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

ordersRouter.post("/:id", async function (req, res) {
  const UserId = Number(req.params.id);
  const ProductId = Number(req.body.productId);
  try {
    await orderService.addNewOrder(UserId, ProductId);
    const ordersList = await orderService.getOrderByUserId(UserId);
    const createdOrder = ordersList[ordersList.length - 1];
    res.status(201).json(createdOrder);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = ordersRouter;
