import { eq, and } from "drizzle-orm";
import { db } from "./lib/db";
import { feedFollows } from "./lib/db/schema";
import { getFeedsByUrl } from "./lib/db/queries/feeds";
export async function Unfollow(url, user) {
    const feeds = await getFeedsByUrl(url);
    const [result] = await db
        .delete(feedFollows)
        .where(and(eq(feedFollows.user_id, user.id), eq(feedFollows.feed_id, feeds.feedId)))
        .returning();
    return result;
}
