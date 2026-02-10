import { db } from "./lib/db";
import { feedFollow, feedFollows } from "./lib/db/schema";

import { getFollowFeeds } from "./lib/db/queries/follows";

export async function createFeedFollow(feed_follow: feedFollow) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values(feed_follow)
    .returning();
  return getFollowFeeds(newFeedFollow.id);
}
