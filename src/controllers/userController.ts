import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "express";

const ApiError = require("../error-handler/errorException");

const {
  registrationUser,
  loginUser,
  deleteToken,
  checkCandidate,
  updateToken,
} = require("../services/userServices");

const registration = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const candidate = await checkCandidate(email);
    if (candidate) {
      return next(
        ApiError.BadRequest(`User with mail ${email} is already exist`)
      );
    }
    const userData = await registrationUser(
      firstName,
      lastName,
      email,
      password
    );
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json(userData);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = await loginUser(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json(userData);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    await deleteToken(refreshToken);
    res.clearCookie("refreshToken");
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("refresh");
    const { refreshToken } = req.cookies;
    const user = await updateToken(refreshToken);
    res.cookie("refreshToken", user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json(user);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = { registration, login, logout, refresh };
