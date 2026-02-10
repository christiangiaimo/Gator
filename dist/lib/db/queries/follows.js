import { db } from "../index";
import { users, feedFollows, feeds } from "../schema";
import { eq } from "drizzle-orm";
export async function getFollowFeeds(feefFollowId) {
    const [result] = await db
        .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feeds: feeds.name,
        feedsUrl: feeds.url,
        users: users.name,
    })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.user_id, users.id))
        .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
        .where(eq(feedFollows.id, feefFollowId));
    return result;
}
