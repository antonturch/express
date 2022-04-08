const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
import db from "./db/models";
import { NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 5000;
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const authMiddleware = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
const authRouter = require("./routes/auth");

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/products", productsRouter);
app.use("/orders", authMiddleware, ordersRouter);
app.use("/auth", authRouter);

// app.get(
//   "/throw-unauthenticated",
//   (req: Express.Request, res: Express.Response, next: NextFunction) => {
//     throw new ErrorException(ErrorCode.Unauthenticated);
//   }
// );

app.use(errorMiddleware);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
