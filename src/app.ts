import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./db/models";
import { ordersRouter, productsRouter } from "./routes";

dotenv.config();

const { errorHandler } = require("./error-handler");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
