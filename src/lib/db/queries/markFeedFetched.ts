import { db } from "../index";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function markFeedFetched(feedId: string) {
  const [result] = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId))
    .returning();

  return result;
}

export async function getNextFeedToFetch();
