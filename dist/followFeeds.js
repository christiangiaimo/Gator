import { db } from "./lib/db";
import { feedFollows } from "./lib/db/schema";
import { getFollowFeeds } from "./lib/db/queries/follows";
export async function createFeedFollow(feed_follow) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values(feed_follow)
        .returning();
    return getFollowFeeds(newFeedFollow.id);
}
