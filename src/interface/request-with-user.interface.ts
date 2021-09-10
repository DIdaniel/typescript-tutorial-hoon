import { Request } from "express";
import { iUser } from "../users/user.interface";

export interface RequestWithUser extends Request {
    user: iUser;
}
