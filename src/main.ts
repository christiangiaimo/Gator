import {
  addFeed,
  agg,
  feeds,
  follow,
  following,
  handlerLogin,
  printFeed,
  printUsers,
  registerHandler,
  resetUsersTable,
} from "./commandHandler";
import { CommandRegistry } from "./commandRegistry";
import { registerCommand } from "./commandRegistry";
import { runCommand } from "./commandRegistry";
import { setUser, readConfig, writeConfig, getConfigFilePath } from "./config";
import { argv, exitCode } from "node:process";
import { log } from "./lib/db";

async function main() {
  //console.log(getConfigFilePath());
  //console.log(readConfig());
  const cmdObject: CommandRegistry = {};
  registerCommand(cmdObject, "login", handlerLogin);
  registerCommand(cmdObject, "register", registerHandler);
  registerCommand(cmdObject, "reset", resetUsersTable);
  registerCommand(cmdObject, "users", printUsers);
  registerCommand(cmdObject, "agg", agg);
  registerCommand(cmdObject, "addfeed", addFeed);
  registerCommand(cmdObject, "feeds", feeds);
  registerCommand(cmdObject, "follow", follow);
  registerCommand(cmdObject, "following", following);

  const args = argv.slice(2);
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  if (args.length === 0) {
    console.log("The program needs at least 1 argument");
    process.exit(1);
  }
  try {
    await runCommand(cmdObject, cmdName, ...cmdArgs);
    process.exit(0);
  } catch (err) {
    throw err;
  }
}

main();
