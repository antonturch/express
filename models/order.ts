"use strict";
import { Model } from "sequelize";

interface OrdersAttributes {
  id: number;
  uId: number;
  pId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model implements OrdersAttributes {
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
      uId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pId: {
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
