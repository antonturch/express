import { errorHandler } from "./error-handler/error-handler";
import { ErrorException } from "./error-handler/error-exception";
import { ErrorCode } from "./error-handler/error-code";
import { NextFunction } from "express";

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
import db from "../models";

const app = express();
const PORT = process.env.PORT || 5000;
const productsRouter = require("./products-router");
const ordersRouter = require("./orders-router");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.get(
  "/throw-unauthenticated",
  (req: Express.Request, res: Express.Response, next: NextFunction) => {
    throw new ErrorException(ErrorCode.Unauthenticated);
  }
);

app.use(errorHandler);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    // await db.sequelize.drop()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
