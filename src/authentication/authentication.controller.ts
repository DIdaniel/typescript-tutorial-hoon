import HttpException from "../exceptions/HttpException";
import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import User from "../users/user.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import validationMiddleware from "../middleware/validation.middleware";
import { LoginDto } from "./dto/login.dto";
import { WrongCredentialExeption } from "../exceptions/wrong-redential.exception";
import { DataStoredInToken } from "../interface/data-stored-in-token.interface";
import { iUser } from "../users/user.interface";
import { TokenData } from "../interface/token-data.interface";

export class AuthenticationController {
  cookie(arg: any): string {
    throw new Error("Method not implemented.");
  }
  public path = "/auth";
  public router = express.Router();
  private user = User;

  constructor() {
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.loggingIn
    );

    this.router.post(`${this.path}/logout`, this.logginOut);
  }

  private registration = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = req.body;

    // 중복 이메일 체크!
    const validateDuplicateEmail = await this.user.findOne({
      email: userData.email,
    });
    if (validateDuplicateEmail) {
      next(new HttpException(409, `${userData.email} is already in use`));
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const savedUser = await this.user.create({
      ...userData,
      password: hashedPassword,
    });

    savedUser.password = undefined;

    const tokenData = this.createToken(savedUser);

    res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
    res.send(savedUser);
  };

  private loggingIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LoginDto = req.body;
    const user = await this.user.findOne({ eamil: loginData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        return res.send(user);
      } else {
        return next(new WrongCredentialExeption());
      }
    } else {
      return next(new WrongCredentialExeption());
    }
  };

  private createToken(user: iUser) {
    const expiresIn = 60 * 60; // 1시간
    const secrete = process.env.JWT_SECRETE;

    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secrete, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private logginOut = (req, res) => {
    res.setheader("Set-Cookie", ["Authorization=; Max-age=0"]);
    res.send(200);
  };
}
