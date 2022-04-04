"use strict";
import { Model } from "sequelize";
import { OrderAttributes } from "../modelsType";

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model implements OrderAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uId!: number;
    pId!: number;

    static associate(models: any) {
      // define association here
      Order.belongsTo(models.User);
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
