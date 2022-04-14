import db from "../db/models";

const getProducts = () => {
  return db.Product.findAll();
};

const getProductById = (productId: number) => {
  return db.Product.findByPk(productId);
};

export default {
  getProducts,
  getProductById,
};
