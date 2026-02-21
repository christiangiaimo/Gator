import { readConfig, setUser } from "./config";
import {
  createFeed,
  getFeeds,
  getFeedsByName,
  getFeedsByUrl,
} from "./lib/db/queries/feeds";
import {
  createUser,
  getUser,
  getUsers,
  resetUsers,
  User,
} from "./lib/db/queries/users";

import { type SelectFeed, type SelectUser } from "./lib/db/schema";
import { createFeedFollow } from "./followFeeds";
import { Unfollow } from "./unfollow";
import { getNextFeedToFetch } from "./lib/db/queries/getNextFeedToFetch";
import { scrapeFeeds } from "./scrapeFeeds";
import { getPostsForUser } from "./lib/db/queries/getPostsForUser";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const name = args[0];
  const user = await getUser(name);
  if (!user) {
    console.log(`User ${name} does not exist. Please register first.`);
    process.exit(1);
  }
  setUser(args[0]);
  console.log(`The ${name} username has been set`);
}

export async function registerHandler(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0];
  const user = await getUser(name);

  if (user) {
    throw new Error("User already exists.");
  }

  const newUser = await createUser(name);
  setUser(newUser.name);
  console.log(`${name} was created`);
  console.log(
    `${newUser.createdAt}, ${newUser.id}, ${newUser.name}, ${newUser.updatedAt}`,
  );
}

export async function resetUsersTable(cmdName: string, ...args: string[]) {
  await resetUsers();
  console.log("Users table has been reset.");
}

export async function printUsers() {
  const users = await getUsers();
  const config = readConfig();
  for (const user of users) {
    if (config.currentUserName === user.name) {
      console.log(`${user.name} (current)`);
    } else {
      console.log(user.name);
    }
  }
}

function parserDuration(duration: string): string {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = duration.match(regex);
  const string = "";
  if (!match) {
    throw new Error("not a valid duration");
  }
  for (const w of match) {
    string.concat(w);
  }
  return string;
}

function getDuration(durationStr: string) {
  if (!durationStr) {
    throw new Error("Invalid duaration");
  }
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.trim().match(regex);
  if (!match) {
    throw new Error("Invalid duartion");
  }

  const value: number = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
  }
}

function handleError(err: unknown) {
  console.error("An error occurred during aggregation:", err);
}

export async function agg(cmdName: string, durationStr: string) {
  //const timeStr = parserDuration(durationStr);
  const time = getDuration(durationStr);
  console.log(`Collecting feeds every ${durationStr}`);
  const runScraper = () => scrapeFeeds().catch(handleError);

  runScraper(); // Ejecución inmediata
  const interval = setInterval(runScraper, time); // Ejecuciones repetidas

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function addFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }
  const name: string = args[0];
  const url: string = args[1];

  const userId = user.id;
  const feed = await createFeed(name, url, userId);
  console.log(`succesfully created feed`);
  const followFeeds = await createFeedFollow({
    user_id: userId,
    feed_id: feed.id,
  });

  printFeed(feed, user);
  console.log(followFeeds.users, followFeeds.feeds);
}

export function printFeed(feed: SelectFeed, user: SelectUser) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function feeds(cmdName: string, user: User, ...args: string[]) {
  const feeds = await getFeeds();
  for (const feed of feeds) {
    console.log(`feedname: ${feed.feedName}`);
    console.log(`feedname: ${feed.url}`);
    console.log(`feedname: ${feed.userName}`);
  }
}

export async function follow(cmdName: string, user: User, ...args: string[]) {
  const url = args[0];
  const userId = user.id;
  const feed = await getFeedsByUrl(url);
  const feedFollow = {
    user_id: userId,
    feed_id: feed.feedId,
  };

  const result = await createFeedFollow(feedFollow);

  console.log(`feedName: ${result.feeds}`);
  console.log(`userName: ${result.users}`);
}

export async function following(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feeds = await getFeedsByName(user.name);
  for (const feed of feeds) {
    console.log(`${feed.feedName}`);
  }
}

export async function unfollow(cmdName: string, user: User, ...args: string[]) {
  const url = args[0];
  await Unfollow(url, user);
  console.log(`Successfully deleted the feed`);
}

export async function browse(cmdName: string, user: string, ...args: string[]) {
  let limit = args[0] ? parseInt(args[0], 10) : 2;
  const posts = await getPostsForUser(user, limit);
  for (const post of posts) {
    console.log(`${post.posts.publishedAt ?? ""} ${post.posts.title}`);
    console.log(`${post.posts.url}`);
    console.log("______________");
  }
}
