import * as express from "express";
import * as jwt from "jsonwebtoken";
import User from "../users/user.model";

import { DataStoredInToken } from "../interface/data-stored-in-token.interface";
import { RequestWithUser } from "../interface/request-with-user.interface";
import { WrongAuthenticationTokenException } from "../exceptions/wrong-auth-token.exception";
import { AuthenticationTokenMissingException } from "../exceptions/auth-token-missing.exception";

async function authMiddleware(
  req: RequestWithUser,
  res: express.Response,
  next: express.NextFunction
) {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;

      const _id = verificationResponse._id;

      const user = await User.findById(_id);
      // query 실패를 하면 undefined가 나온다!
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (err) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
