import db from "../db/models";

const getOrdersByUserId = (UserId: number) => {
  return db.Order.findAll({
    where: { UserId },
  });
};
const getOrderById = (id: number) => {
  return db.Order.findOne({
    where: { id },
  });
};

const addNewOrder = (UserId: number, ProductId: number) => {
  return db.Order.create({ UserId, ProductId });
};

export default {
  getOrdersByUserId,
  getOrderById,
  addNewOrder,
};
