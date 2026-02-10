import { db } from "../index";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";
export async function createFeed(name, url, userId) {
    const [result] = await db
        .insert(feeds)
        .values({ name: name, url: url, user_id: userId })
        .returning();
    return result;
}
export async function getFeeds() {
    const result = await db
        .select({ feedName: feeds.name, url: feeds.url, userName: users.name })
        .from(feeds)
        .innerJoin(users, eq(feeds.user_id, users.id));
    return result;
}
export async function getFeedsByUrl(feedUrl) {
    const [result] = await db
        .select({ feedName: feeds.name, userName: users.name, feedId: feeds.id })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.user_id, users.id))
        .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
        .where(eq(feeds.url, feedUrl));
    return result;
}
export async function getFeedsByName(name) {
    const result = await db
        .select({ feedName: feeds.name, url: feeds.url, userName: users.name })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.user_id, users.id))
        .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
        .where(eq(users.name, name));
    return result;
}
