import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "express";

const ApiError = require("../error-handler/errorException");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
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

const googleRegistration = async function (
  req: Request,
  res: Response,
  // next: NextFunction
) {
  try {
    passport.authenticate("google", { session: false });
    // @ts-ignore
    console.log(req.user);
    // @ts-ignore
    const { given_name, family_name, email } = req.user;
    const candidate = await checkCandidate(email);
    // if (candidate) {
    //   return next(
    //     ApiError.BadRequest(`User with mail ${email} is already exist`)
    //   );
    // }
    const userData = await registrationUser(
      given_name,
      family_name,
      email,
      "password"
    );
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json(userData);
    res.redirect("http://localhost:3000/products");
  } catch (e) {
    console.log(e);
    // next(e);
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

const googleAuthInitialization = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/gg",
        passReqToCallback: false,
      },
      function (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) {
        // @ts-ignore
        // request.user = profile;
        // @ts-ignore
        // console.log(request.user);
        return done(null, profile);
      }
    )
  );
};

const googleAuthRedirect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("google", {
    successRedirect: "/orders",
    failureRedirect: "/failure",
  });
};

const googleAuthFailure = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    req.logout();
    // @ts-ignore
    req.session.destroy();
    const { refreshToken } = req.cookies;
    await deleteToken(refreshToken);
    res.clearCookie("refreshToken");
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const googleLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    req.logout();
    // @ts-ignore
    req.session.destroy();
    // @ts-ignore
    console.log(req.session);
    res.json("Google logOut");
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

module.exports = {
  registration,
  login,
  logout,
  googleLogout,
  refresh,
  googleAuthInitialization,
  googleAuthRedirect,
  googleAuthFailure,
};
