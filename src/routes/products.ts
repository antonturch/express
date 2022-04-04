import express from "express";
import { ProductAttributes } from "../db/modelsType";

const { productService } = require("../services");

const products = express.Router();

products.use((req, res, next) => {
  console.log("Request products router");
  next();
});

products.get("/", async function (req, res) {
  try {
    const products: ProductAttributes[] = await productService.getAll();
    res.json(products);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

products.get("/:id", async function (req, res) {
  const productId = Number(req.params.id);
  try {
    const product: ProductAttributes = await productService.getProductById(
      productId
    );
    res.json(product);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

module.exports = products;
