import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import passport from "passport";
import { NextFunction } from "express";
import { Strategy } from "passport-google-oauth2";
import { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { userService } from "../services";
import { BadRequestError } from "../error-handler/custom-errors";
import { IAuthorizedRequest } from "../data-mappers/request";
import userToDTO from "../data-mappers/user";
import { getClientUrl, TokenType } from "../utils";
import { ClientPath } from "../utils/ClientPath";
import { GoogleUser } from "../db/modelsType";
import tokenService from "../services/tokenService";

dotenv.config();

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.CALLBACK_GOOGLE_URL as string,
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

const setTokenToCookie = (
  res: Response,
  tokenType: TokenType,
  token: string,
  maxAge: number,
  httpOnly: boolean = true
) => {
  res.cookie(tokenType, token, {
    maxAge,
    httpOnly,
  });
};

const registration = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const candidate = await userService.checkCandidate(email);
    if (candidate) {
      return next(
        new BadRequestError({
          message: `User with email ${email} is already exist`,
        })
      );
    }
    const userData = await userService.registerUser(
      firstName,
      lastName,
      email,
      password
    );

    setTokenToCookie(
      res,
      TokenType.RefreshToken,
      userData.refreshToken,
      Number(process.env.JWT_REFRESH_LIFETIME)
    );

    res.json(userData);
  } catch (e) {
    next(
      new BadRequestError({
        message: `Error during registration`,
      })
    );
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.loginUser(email, password);
    setTokenToCookie(
      res,
      TokenType.RefreshToken,
      userData.refreshToken,
      Number(process.env.JWT_REFRESH_LIFETIME),
      false
    );

    res.json(userData);
  } catch (e) {
    next(e);
  }
};

const googleAuthRedirect = async (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: GoogleUser = {
      firstName: req.user.given_name,
      lastName: req.user.family_name,
      email: req.user.email,
      password: req.user.id,
    };
    const userData = await userService.findOrCreateUser(user);
    const accessToken = tokenService.generateAccessToken(
      { data: userToDTO(userData) },
      Number(process.env.JWT_ACCESS_LIFETIME)
    );

    setTokenToCookie(
      res,
      "jwt" as TokenType,
      accessToken,
      Number(process.env.JWT_ACCESS_LIFETIME),
      false
    );
    res.redirect(getClientUrl(ClientPath.Products));
  } catch (e) {
    next(
      new BadRequestError({
        message: `Error during google login. Incorrect credentials`,
      })
    );
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await tokenService.deleteRefreshToken(refreshToken);
      res.clearCookie(TokenType.RefreshToken);
    }
    res.clearCookie("jwt");
    res.sendStatus(StatusCodes.OK);
  } catch (e) {
    next(
      new BadRequestError({
        message: `Error during logout from system`,
      })
    );
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const user = await userService.updateAccessAndRefreshTokens(refreshToken);

    setTokenToCookie(
      res,
      TokenType.RefreshToken,
      user.refreshToken,
      Number(process.env.JWT_REFRESH_LIFETIME)
    );

    res.json(user);
  } catch (e) {
    next(
      new BadRequestError({
        message: `Error during refresh token`,
      })
    );
  }
};

export default {
  registration,
  login,
  logout,
  refresh,
  googleAuthRedirect,
};
