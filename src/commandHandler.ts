import { readConfig, setUser } from "./config";
import { fetchFeed } from "./fetch";
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
} from "./lib/db/queries/users";

import {
  feedFollow,
  feedFollows,
  type SelectFeed,
  type SelectUser,
} from "./lib/db/schema";
import { getFollowFeeds } from "./lib/db/queries/follows";
import { createFeedFollow } from "./followFeeds";

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

export async function agg(cmdName: string, ...args: string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(feed.channel);
}

export async function addFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }
  const name: string = args[0];
  const url: string = args[1];
  const config = readConfig();
  if (!config.currentUserName) {
    throw new Error("No current user");
  }
  const user = await getUser(config.currentUserName);

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

export async function feeds(cmdName: string, ...args: string[]) {
  const config = readConfig();
  if (!config.currentUserName) {
    throw new Error("No current user");
  }
  const user = await getUser(config.currentUserName);

  const feeds = await getFeeds();
  for (const feed of feeds) {
    console.log(`feedname: ${feed.feedName}`);
    console.log(`feedname: ${feed.url}`);
    console.log(`feedname: ${feed.userName}`);
  }
}

export async function follow(cmdName: string, ...args: string[]) {
  const url = args[0];
  const config = readConfig();
  if (!config.currentUserName) {
    throw new Error("No current user");
  }
  const user = await getUser(config.currentUserName);
  const userId = user.id;
  const name = user.name;
  const feed = await getFeedsByUrl(url);
  const feedFollow = {
    user_id: userId,
    feed_id: feed.feedId,
  };

  const result = await createFeedFollow(feedFollow);

  console.log(`feedName: ${result.feeds}`);
  console.log(`userName: ${result.users}`);
}

export async function following(cmdName: string, ...args: string[]) {
  const config = readConfig();
  const user = config.currentUserName;
  if (!user) {
    throw new Error("No current user");
  }
  const feeds = await getFeedsByName(user);
  for (const feed of feeds) {
    console.log(`${feed.feedName}`);
  }
}
