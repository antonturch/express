// @ts-ignore
const db = require("../db/models");

const getOrderByUserId = (UserId: number) => {
  return db.default.Order.findAll({
    where: { UserId },
  });
};

const addNewOrder = (UserId: number, ProductId: number) => {
  return db.default.Order.create({ UserId, ProductId });
};

module.exports = {
  getOrderByUserId,
  addNewOrder,
};
