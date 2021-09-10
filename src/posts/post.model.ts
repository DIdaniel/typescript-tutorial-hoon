import * as mongoose from "mongoose";
import { iPost } from "./post.interface";

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
});

const postModel = mongoose.model<iPost & mongoose.Document>("Post", postSchema);

export default postModel;
