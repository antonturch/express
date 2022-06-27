import db from "../db/models";
import { IProduct } from "../db/modelsType";

const getProducts = (): Promise<IProduct[]> => {
  return db.Product.findAll();
};

const getProductById = (productId: number): Promise<IProduct> => {
  return db.Product.findByPk(productId);
};

export default {
  getProducts,
  getProductById,
};
