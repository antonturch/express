import express from "express";

const { orderService } = require("../services");

const ordersRouter = express.Router();

ordersRouter.use((req, res, next) => {
  console.log("Request order router");
  next();
});

ordersRouter.get("/:id", async function (req, res) {
  const UserId = Number(req.params.id);
  try {
    const ordersList = await orderService.getOrderByUserId(UserId);
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
    const ordersList = await orderService.addNewOrder(UserId, ProductId);
    // res.sendStatus(200);
    // console.log(ordersList.dataValues)
    //Todo: what we should return to clint side here?
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = ordersRouter;
