import { db } from "../index";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";
export async function markFeedFetched(feedId) {
    const [result] = await db
        .update(feeds)
        .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
        .where(eq(feeds.id, feedId))
        .returning();
    return result;
}
