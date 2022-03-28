"use strict";
import { Model } from "sequelize";

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  img: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model implements ProductAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    name!: string;
    description!: string;
    price!: number;
    currency!: string;
    img!: string;

    static associate(models: any) {
      // define association here
      Product.hasMany(models.Order);
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
