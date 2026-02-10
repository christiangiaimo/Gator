import { readConfig } from "./config";
import { getFeedsByName } from "./lib/db/queries/feeds";
export async function getFeedFollowsForUser(name) {
    const config = readConfig();
    if (!config.currentUserName) {
        throw new Error("No current user");
    }
    const feeds = await getFeedsByName(name);
    return feeds;
}
