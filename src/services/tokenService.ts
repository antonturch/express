import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import db from "../db/models";
import dotenv from "dotenv";

dotenv.config();

console.log();

interface IJwtPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface TokensObj {
  accessToken: string;
  refreshToken: string;
}

const updateRefreshToken = (userId: number, refreshToken: string) => {
  return db.User.update(
    {
      refreshToken,
    },
    {
      where: {
        id: userId,
      },
    }
  );
};

const generateAccessToken = (
  payload: { data: IJwtPayload },
  expiresIn: number | string
): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn,
  });
};

const generateAccessAndRefreshTokens = (payload: IJwtPayload): TokensObj => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: Number(process.env.JWT_ACCESS_LIFETIME),
    }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: Number(process.env.JWT_REFRESH_LIFETIME),
    }
  );
  return { accessToken, refreshToken };
};

const validateAccessToken = (
  accessToken: string
): JwtPayload | string | null => {
  try {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const validateRefreshToken = (
  refreshToken: string
): JwtPayload | string | null => {
  //Todo: it's possible to set return type IUser?
  try {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const deleteRefreshToken = (refreshToken: string) => {
  return db.User.update(
    {
      refreshToken: null,
    },
    {
      where: {
        refreshToken,
      },
    }
  );
};

export default {
  updateRefreshToken,
  generateAccessToken,
  generateAccessAndRefreshTokens,
  deleteRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};
