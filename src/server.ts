import "dotenv/config";
import { PostsController } from "./posts/posts.controller";
import App from "./app";
import { AuthenticationController } from "./authentication/authentication.controller";

const app = new App(
    [new PostsController(), new AuthenticationController()],
    process.env.PORT
);

console.log(process.env.MONGO_SRV);
console.log(process.env.PORT);

app.listen();
