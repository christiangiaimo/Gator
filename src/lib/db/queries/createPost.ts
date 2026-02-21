import { db } from "../index";
import { type Posts, posts } from "../schema";

export async function createPost(
  title: string,
  url: string,
  feedId: string,
  description?: string,
) {
  const [result]: Posts[] = await db
    .insert(posts)
    .values({
      title: title,
      url: url,
      description: description,
      feed_id: feedId,
    })
    .onConflictDoNothing({ target: posts.url })
    .returning();
  return result;
}
