import { NextFunction, Request, Response } from "express";
import { productService } from "../services";
import { NotFoundError } from "../error-handler/custom-errors";
import { ErrorCodes } from "../error-handler/errorCodes";

interface ProductsRequestParams {
  id: number;
}

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProducts();

    res.json(products);
  } catch (e) {
    next(e);
  }
};

const getProductById = async (
  req: Request<ProductsRequestParams>,
  res: Response,
  next: NextFunction
) => {
  const productId = req.params.id;

  try {
    const product = await productService.getProductById(productId);

    if (!product) {
      throw new NotFoundError({
        message: `Product with id ${productId} was not found`,
        code: ErrorCodes.PRODUCT_NOT_FOUND,
      });
    }

    res.json(product);
  } catch (e) {
    next(e);
  }
};

export default {
  getProducts,
  getProductById,
};
