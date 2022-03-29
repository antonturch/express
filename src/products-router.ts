import express from "express";
import db from "../models";

const productsRouter = express.Router();

productsRouter.use((req, res, next) => {
  console.log("Request products router");
  next();
});

productsRouter.get("/", async function (req, res) {
  try {
    const products = await db.Product.findAll();
    res.json(products);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

productsRouter.get("/:id", async function (req, res) {
  const id = Number(req.params.id);
  try {
    const product = await db.Product.findByPk(id);
    res.json(product);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

module.exports = productsRouter;
