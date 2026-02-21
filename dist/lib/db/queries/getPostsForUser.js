import { db } from "../index";
import { feeds, posts, users } from "../schema";
import { eq, desc } from "drizzle-orm";
export async function getPostsForUser(user, postQty) {
    const result = await db
        .select({ posts: posts })
        .from(posts)
        .innerJoin(feeds, eq(feeds.id, posts.feed_id))
        .innerJoin(users, eq(users.id, feeds.user_id))
        .where(eq(users.name, user))
        .orderBy(desc(posts.publishedAt))
        .limit(postQty);
    return result;
}
