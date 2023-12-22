import { createApp, eventHandler } from "h3";
import { postsRouter } from "@/routes/posts";

const app = createApp();

app.use(postsRouter).use(
  "/",
  eventHandler(() => {
    return "<h1>Hello world</h1>";
  })
);

export { app };
