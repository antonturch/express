import express from "express";
import { IProduct } from "../db/modelsType";
import { productService } from "../services";

const productsRouter = express.Router();

productsRouter.get("/", async function (req, res) {
  try {
    const products: IProduct[] = await productService.getProducts();
    res.json(products);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

productsRouter.get("/:id", async function (req, res) {
  const productId = Number(req.params.id);
  try {
    const product: IProduct = await productService.getProductById(productId);
    res.json(product);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

export default productsRouter;
