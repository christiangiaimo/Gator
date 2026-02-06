import { handlerLogin } from "./commandHandler";
import { CommandRegistry } from "./commandRegistry";
import { registerCommand } from "./commandRegistry";
import { runCommand } from "./commandRegistry";
import { setUser, readConfig, writeConfig } from "./config";
import { argv, exitCode } from "node:process";

function main() {
  const cmdObject: CommandRegistry = {};
  registerCommand(cmdObject, "login", handlerLogin);
  const args = argv.slice(2);
  const name = args[0];
  const argument = args.slice(0);
  if (args.length === 0) {
    console.log("The program needs at least 1 argument");
    process.exit(1);
  }

  runCommand(cmdObject, name, ...argument);
}

main();
