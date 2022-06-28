import express from "express";
import productsController from "../controllers/productsController";
import { GetItemByIdInParamsValidationSchema } from "../middleware/validationSchemas";
import { validationMiddleware } from "../middleware/validationMiddleware";

const productsRouter = express.Router();

productsRouter.get("/", productsController.getProducts);

productsRouter.get(
  "/:id",
  GetItemByIdInParamsValidationSchema,
  validationMiddleware,
  productsController.getProductById
);

export default productsRouter;
