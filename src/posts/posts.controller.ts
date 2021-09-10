import * as express from "express";
import Post from "./post.model";
import HttpException from "../exceptions/HttpException";
import PostNotFoundException from "../exceptions/post-not-found.exception";
import { CreatePostDto } from "./dto/create-post.dto";
import validationMiddleware from "../middleware/validation.middleware";
import authMiddleware from "../middleware/auth.middleware";
import { RequestWithUser } from "../interface/request-with-user.interface";

//@API /api/v1/posts의 posts 같은!
export class PostsController {
  public path = "/posts";
  public router = express.Router();

  constructor() {
    this.initializeRoute();
  }

  public initializeRoute() {
    // this.router.use(this.path, authMiddle);
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post(
        this.path,

        validationMiddleware(CreatePostDto),
        this.createPost
      )
      .patch(`${this.path}/:id`, this.updatePost)
      .delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = async (req: express.Request, res: express.Response) => {
    const postResult = await Post.find();
    res.send(postResult);
  };

  getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) {
      return next(new PostNotFoundException(id));
    }

    res.send(post);
  };

  createPost = async (req: RequestWithUser, res: express.Response) => {
    const postData = req.body;
    const post = new Post({
      ...postData,
      author: req.user._id,
    });

    const savedPost = await post.save();
    res.send(savedPost);
  };

  // CRUD => Update
  updatePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return next(new PostNotFoundException(id));
    }

    const postData = req.body;
    try {
      const updatedPost = await Post.findByIdAndUpdate(id, postData, {
        new: true,
      });
      res.send(updatedPost);
    } catch (err) {
      console.error(err);
    }
  };

  deletePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return next(new PostNotFoundException(id));
    }

    const result = await Post.findByIdAndDelete(id);
    res.send(result);
  };
}
