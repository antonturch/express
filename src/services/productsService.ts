import db from "../db/models";
import { IOrder, IProduct } from "../db/modelsType";

const getProducts = (): Promise<IProduct[]> => {
  return db.Product.findAll();
};

const getProductById = (productId: number): Promise<IProduct> => {
  return db.Product.findByPk(productId);
};

const getProductsForOrderList = async (
  orders: IOrder[]
): Promise<IProduct[]> => {
  const productsId = new Set();
  orders.map((order) => productsId.add(order.ProductId));
  let products: IProduct[] = [];

  for (const productId of [...productsId]) {
    const product = await db.Product.findByPk(productId);
    products = [...products, product];
  }

  return products;
};

export default {
  getProducts,
  getProductById,
  getProductsForOrderList,
};
