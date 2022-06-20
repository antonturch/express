import { ModelStatic } from "sequelize/types/model";

const Order = require("./models/order");
const Product = require("./models/product");
const User = require("./models/user");

export interface IOrder {
  id: number;
  UserId: number;
  ProductId: number;
}

export interface IFullOrder {
  orderId: number
  productId: number
  productName: string
  productImg: string
  price: number
  currency: string
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  img: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserFull extends IUser {
  password: string;
  refreshToken: string;
}

export interface IModels {
  Order: ModelStatic<typeof Order>;
  Product: ModelStatic<typeof Product>;
  User: ModelStatic<typeof User>;
}
