import { UsersAttributes } from "../db/modelsType";

const db = require("../db/models");
const jwt = require("jsonwebtoken");
const ApiError = require("../error-handler/errorException");
const bcrypt = require("bcrypt");

const registrationUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const hashPassword = await bcrypt.hash(password, 2);
  let user: UsersAttributes = await createUser(
    firstName,
    lastName,
    email,
    hashPassword
  );
  const tokens = generateJwt({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
  });
  await updateUser(user.id, tokens.refreshToken);
  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const loginUser = async (email: string, password: string) => {
  const user = await checkCandidate(email);
  if (!user) {
    throw ApiError.BadRequest(`User with mail ${email} is not registered yet`);
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw ApiError.BadRequest(`You have entered an incorrect password`);
  }
  const tokens = generateJwt({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
  });
  await updateUser(user.id, tokens.refreshToken);
  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const checkCandidate = (email: string) => {
  return db.default.User.findOne({
    where: { email },
  });
};

const createUser = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return db.default.User.create({ firstName, lastName, email, password });
};

const updateUser = (userId: number, refreshToken: string) => {
  return db.default.User.update(
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

const generateJwt = (payload: unknown) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15s",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30s",
  });
  return { accessToken, refreshToken };
};

const validateAccessToken = (accessToken: string) => {
  try {
    const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const validateRefreshToken = (refreshToken: string) => {
  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const deleteToken = (refreshToken: string) => {
  return db.default.User.update(
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
  return db.default.User.findOne({
    where: { refreshToken },
  });
};

const updateToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError();
  }
  const userData = validateRefreshToken(refreshToken);
  console.log(userData);
  const tokenFromDb = findToken(refreshToken);
  if (!userData || !tokenFromDb) {
    throw new Error("Token isn't valid or not found on db");
  }
  const tokens = generateJwt({
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
  });
  await updateUser(userData.id, tokens.refreshToken);
  return {
    user: {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

module.exports = {
  registrationUser,
  loginUser,
  checkCandidate,
  createUser,
  updateUser,
  generateJwt,
  deleteToken,
  updateToken,
  validateAccessToken,
};
