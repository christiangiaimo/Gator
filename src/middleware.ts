import { CommandHandler } from "./commandHandler";
import { readConfig } from "./config";
import { getUser, User } from "./lib/db/queries/users";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const config = readConfig();
    const userName = config.currentUserName;
    if (!userName) {
      throw new Error("No current user");
    }
    const user = await getUser(userName);
    if (!user) {
      throw new Error("No current user");
    }
    return await handler(cmdName, user, ...args);
  };
}
