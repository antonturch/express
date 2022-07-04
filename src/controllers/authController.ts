import dotenv from "dotenv";
import { NextFunction } from "express";
import { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { OAuth2Client } from "google-auth-library";
import { userService } from "../services";
import { BadRequestError } from "../error-handler/custom-errors";
import { TokenType } from "../utils";
import tokenService from "../services/tokenService";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignInClient = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.CLIENT_ID,
    });
    // @ts-ignore
    const { email, given_name, family_name, sub } = ticket.getPayload();
    const user = await userService.checkCandidate(email);

    const userData = user
      ? await userService.loginUser(email, sub)
      : await userService.registerUser(given_name, family_name, email, sub);
    setTokenToCookie(res, TokenType.RefreshToken, userData.refreshToken, 30000);

    res.status(StatusCodes.OK).json(userData);
  } catch (e) {
    new BadRequestError({
      message: `Error during authentication`,
    });
  }
};

const setTokenToCookie = (
  res: Response,
  tokenType: TokenType,
  token: string,
  maxAge: number
) => {
  res.cookie(tokenType, token, {
    maxAge,
    httpOnly: true,
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
      Number(process.env.JWT_REFRESH_LIFETIME)
    );

    res.json(userData);
  } catch (e) {
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await tokenService.deleteRefreshToken(refreshToken);
      res.clearCookie(TokenType.RefreshToken);
    }
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
    if (!refreshToken) {
      return;
    }
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
  googleSignInClient,
};
