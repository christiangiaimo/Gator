import { db } from "../index";
import { feeds } from "../schema";
import { sql } from "drizzle-orm";
export async function getNextFeedToFetch() {
    if (!db) {
        throw new Error("Database is null or doesnt exists");
    }
    const [result] = await db
        .select()
        .from(feeds)
        .orderBy(sql `${feeds.lastFetchedAt} asc nulls first`)
        .limit(1);
    return result;
}
