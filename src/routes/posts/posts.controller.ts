import { H3Event, EventHandlerRequest, getRouterParams } from "h3";
import path from "node:path";
import { readFileSync } from "node:fs";

const POST_PATH = "./src/db/posts.json";

const postList = (): [] => {
  const posts = readFileSync(path.resolve(POST_PATH), {
    encoding: "utf-8",
  });
  const parsedData: [] = JSON.parse(posts).data;
  return parsedData;
};

export class PostController {
  public getAllPost() {
    const allPost = postList();
    return allPost;
  }
  public getPostById(e: H3Event<EventHandlerRequest>) {
    const params = getRouterParams(e);
    const dataList: any[] = postList();
    console.log(dataList);
    const post = dataList.find((item: any) => {
      return params.id === item.id;
    });
    if (!post) {
      return `<h2>Post with id of ${params.id} does not exist :(</h2>`;
    }
    return post;
  }
}
