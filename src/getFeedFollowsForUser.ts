import { readConfig } from "./config";
import { db } from "./lib/db";
import { getFeedsByName } from "./lib/db/queries/feeds";
import { getUser } from "./lib/db/queries/users";

export async function getFeedFollowsForUser(name: string) {
  const config = readConfig();
  if (!config.currentUserName) {
    throw new Error("No current user");
  }
  const feeds = await getFeedsByName(name);
  return feeds;
}
