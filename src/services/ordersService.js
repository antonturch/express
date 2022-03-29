const db = require("../db/models");

const getOrderByUserId = (UserId) => {
  return db.default.Order.findAll({
    where: { UserId },
  });
};

const addNewOrder = (UserId, ProductId) => {
  return db.default.Order.create({ UserId, ProductId });
};

module.exports = {
  getOrderByUserId,
  addNewOrder,
};
