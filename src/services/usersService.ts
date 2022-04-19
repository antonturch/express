import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/models";
import { userService } from "./index";
import userToDTO from "../data-mappers/user";
import { IUserFull, IUser } from "../db/modelsType";
import {
  BadRequestError,
  UnauthorizedError,
} from "../error-handler/custom-errors";

interface IJwtPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const registrationUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const hashPassword = await bcrypt.hash(password, 2);
  const user: IUserFull = await createUser(
    firstName,
    lastName,
    email,
    hashPassword
  );
  const userDTO = userToDTO(user);
  const tokens = generateJwt(userToDTO(user));
  await updateUser(user.id, tokens.refreshToken);
  return {
    user: {
      ...userDTO,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const loginUser = async (email: string, password: string) => {
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
  const tokens = generateJwt(userDTO);
  await updateUser(user.id, tokens.refreshToken);
  return {
    user: {
      ...userDTO,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const checkCandidate = (email: string) => {
  return db.User.findOne({
    where: { email },
  });
};

const createUser = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return db.User.create({ firstName, lastName, email, password });
};

const updateUser = (userId: number, refreshToken: string) => {
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

const generateJwt = (payload: IJwtPayload) => {
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

const validateAccessToken = (accessToken: string) => {
  try {
    const userData = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    );
    return userData;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const validateRefreshToken = (refreshToken: string): IUser | null => {
  try {
    const userData = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );
    return userData as IUser;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const deleteToken = (refreshToken: string) => {
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

const findToken = (refreshToken: string) => {
  return db.User.findOne({
    where: { refreshToken },
  });
};

const updateToken = async (refreshToken: string) => {
  console.log("updateToken");
  if (!refreshToken) {
    throw new UnauthorizedError({ message: "Refresh token is missed" });
  }
  const user = validateRefreshToken(refreshToken);
  const tokenFromDb = findToken(refreshToken);
  if (!user || !tokenFromDb) {
    throw new UnauthorizedError({
      message: "Token is invalid or not found on db",
    });
  }
  const userDTO = userToDTO(user as IUserFull);
  const tokens = generateJwt(userDTO);
  console.log(userDTO);
  await updateUser(user.id, tokens.refreshToken);
  return {
    user: { ...userDTO },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

async function findOrCreate(user: any) {
  const candidate = await userService.checkCandidate(user.email);
  if (!candidate) {
    const registeredUser = await userService.createUser(
      user.firstName,
      user.lastName,
      user.email,
      user.password
    );
    return registeredUser;
    //todo check the password here over
  } else {
    if (!candidate.password === user.password) {
      throw new UnauthorizedError({
        message: `User data from google is invalid`,
      });
    }
    return candidate;
  }
}

export default {
  registrationUser,
  loginUser,
  checkCandidate,
  createUser,
  updateUser,
  generateJwt,
  deleteToken,
  updateToken,
  validateAccessToken,
  findOrCreate,
};
