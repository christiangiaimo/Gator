import { db } from "../index";
import { posts } from "../schema";
export async function createPost(title, url, feedId, description) {
    const [result] = await db
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
