import { createRouter, eventHandler } from "h3";
import { PostController } from "./posts.controller";

const postController = new PostController();

export const postsRouter = createRouter()
  .get("/posts", eventHandler(postController.getAllPost))
  .get("/posts/:id", eventHandler(postController.getPostById));
