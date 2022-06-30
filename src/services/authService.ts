import bcrypt from "bcrypt";
import db from "../db/models";
import { userService } from "./index";
import userToDTO from "../data-mappers/user";
import { GoogleUser, IUserFull, UserWithTokens } from "../db/modelsType";
import {
  BadRequestError,
  UnauthorizedError,
} from "../error-handler/custom-errors";
import tokenService from "./tokenService";

const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<UserWithTokens> => {
  const hashPassword = await bcrypt.hash(password, 2);
  const user = await createUser(firstName, lastName, email, hashPassword);
  const userDTO = userToDTO(user);
  const tokens = tokenService.generateAccessAndRefreshTokens(userDTO);

  await tokenService.updateRefreshToken(user.id, tokens.refreshToken);

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
  const tokens = tokenService.generateAccessAndRefreshTokens(userDTO);
  await tokenService.updateRefreshToken(user.id, tokens.refreshToken);
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

const findUserById = (id: number) => {
  return db.User.findOne({
    where: { id },
  });
};

const updateAccessAndRefreshTokens = async (
  refreshToken: string
): Promise<UserWithTokens> => {
  if (!refreshToken) {
    throw new UnauthorizedError({ message: "Refresh token is missed" });
  }
  const user = tokenService.validateRefreshToken(refreshToken);
  if (!user || typeof user === "string") {
    throw new UnauthorizedError({
      message: "Token is invalid or not found in db",
    });
  }
  const userFromDb = await findUserById(user.id);
  console.log("user type", user);
  console.log("userFromDb", userFromDb);
  if (!userFromDb) {
    throw new UnauthorizedError({
      message: "User id is wrong and was not found in db",
    });
  }
  const userDTO = userToDTO(user as IUserFull);
  const tokens = tokenService.generateAccessAndRefreshTokens(userDTO);
  await tokenService.updateRefreshToken(user.id, tokens.refreshToken);
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
  updateAccessAndRefreshTokens,
  findOrCreateUser,
};
