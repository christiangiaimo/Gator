import { handlerLogin, printUsers, registerHandler, resetUsersTable, } from "./commandHandler";
import { registerCommand } from "./commandRegistry";
import { runCommand } from "./commandRegistry";
import { readConfig, getConfigFilePath } from "./config";
import { argv } from "node:process";
async function main() {
    console.log(getConfigFilePath());
    console.log(readConfig());
    const cmdObject = {};
    registerCommand(cmdObject, "login", handlerLogin);
    registerCommand(cmdObject, "register", registerHandler);
    registerCommand(cmdObject, "reset", resetUsersTable);
    registerCommand(cmdObject, "users", printUsers);
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
    }
    catch (err) {
        throw err;
    }
}
main();
