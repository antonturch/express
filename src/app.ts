import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import db from "./db/models";
import { authRouter, ordersRouter, productsRouter } from "./routes";
import { authMiddleware, errorMiddleware } from "./middleware/";

const PORT = process.env.PORT || 5000;

const app = express();

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

app.use(errorMiddleware);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
