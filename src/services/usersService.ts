import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/models";
import { userService } from "./index";
import userToDTO from "../data-mappers/user";
import { GoogleUser, IUserFull, UserWithTokens } from "../db/modelsType";
import {
  BadRequestError,
  UnauthorizedError,
} from "../error-handler/custom-errors";

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

const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<UserWithTokens> => {
  const hashPassword = await bcrypt.hash(password, 2);
  const user = await createUser(firstName, lastName, email, hashPassword);
  const userDTO = userToDTO(user);
  const tokens = generateAccessAndRefreshTokens(userDTO);

  await updateRefreshToken(user.id, tokens.refreshToken);

  return {
    user: {
      ...userDTO,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const loginUser = async (
  email: string,
  password: string
): Promise<UserWithTokens> => {
  const user = await checkCandidate(email);

  if (!user) {
    throw new BadRequestError({
      message: `User with mail ${email} is not registered yet`,
    });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new BadRequestError({
      message: `You entered an incorrect password`,
    });
  }
  const userDTO = userToDTO(user);
  const tokens = generateAccessAndRefreshTokens(userDTO);
  await updateRefreshToken(user.id, tokens.refreshToken);
  return {
    user: {
      ...userDTO,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const checkCandidate = (email: string): IUserFull => {
  return db.User.findOne({
    where: { email },
  });
};

const createUser = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): IUserFull => {
  return db.User.create({ firstName, lastName, email, password });
};

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
      expiresIn: "15s",
    }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "30s",
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

const findRefreshToken = (refreshToken: string) => {
  return db.User.findOne({
    where: { refreshToken },
  });
};

const updateAccessAndRefreshTokens = async (
  refreshToken: string
): Promise<UserWithTokens> => {
  if (!refreshToken) {
    throw new UnauthorizedError({ message: "Refresh token is missed" });
  }
  const user = validateRefreshToken(refreshToken);
  const tokenFromDb = findRefreshToken(refreshToken);
  if (!user || typeof user === "string" || !tokenFromDb) {
    throw new UnauthorizedError({
      message: "Token is invalid or not found on db",
    });
  }
  const userDTO = userToDTO(user as IUserFull);
  const tokens = generateAccessAndRefreshTokens(userDTO);
  await updateRefreshToken(user.id, tokens.refreshToken);
  return {
    user: { ...userDTO },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

async function findOrCreateUser(user: GoogleUser): Promise<IUserFull> {
  const candidate = await userService.checkCandidate(user.email);
  if (!candidate) {
    return userService.createUser(
      user.firstName,
      user.lastName,
      user.email,
      user.password
    );
    //todo check the password here over
  } else {
    if (candidate.password !== user.password) {
      throw new UnauthorizedError({
        message: `User data from google is invalid`,
      });
    }
    return candidate;
  }
}

export default {
  registerUser,
  loginUser,
  checkCandidate,
  createUser,
  generateAccessToken,
  updateRefreshToken,
  generateAccessAndRefreshTokens,
  deleteRefreshToken,
  updateAccessAndRefreshTokens,
  validateAccessToken,
  findOrCreateUser,
};
