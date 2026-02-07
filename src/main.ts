import { handlerLogin, registerHandler } from "./commandHandler";
import { CommandRegistry } from "./commandRegistry";
import { registerCommand } from "./commandRegistry";
import { runCommand } from "./commandRegistry";
import { setUser, readConfig, writeConfig } from "./config";
import { argv, exitCode } from "node:process";

async function main() {
  const cmdObject: CommandRegistry = {};
  registerCommand(cmdObject, "login", handlerLogin);
  registerCommand(cmdObject, "register", registerHandler);
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
    console.error("DEBUG ERROR in run command:", err);
    throw err;
  }
}

main();
