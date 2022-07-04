import { DataTypes, Model, Sequelize } from "sequelize";
import { IModels, IOrder } from "../modelsType";

module.exports = (sequelize: Sequelize) => {
  class Order extends Model implements IOrder {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    UserId!: number;
    ProductId!: number;

    static associate(models: IModels) {
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
