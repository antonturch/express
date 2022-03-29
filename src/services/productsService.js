const db = require("../db/models");

const getAll = () => {
  return db.default.Product.findAll();
};

const getProductById = (productId) => {
  return db.default.Product.findByPk(productId);
};

module.exports = {
  getAll,
  getProductById,
};
