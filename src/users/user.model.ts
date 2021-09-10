import * as mongoose from "mongoose";
import { iUser } from "./user.interface";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model<iUser & mongoose.Document>("User", userSchema);

export default User;
