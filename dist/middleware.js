import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
export function middlewareLoggedIn(handler) {
    return async (cmdName, ...args) => {
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
