// @ts-ignore
const db = require("../db/models");

const getAll = () => {
  return db.default.Product.findAll();
};

const getProductById = (productId: number) => {
  return db.default.Product.findByPk(productId);
};

module.exports = {
  getAll,
  getProductById,
};
