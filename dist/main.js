import { handlerLogin } from "./commandHandler";
import { registerCommand } from "./commandRegistry";
import { runCommand } from "./commandRegistry";
import { argv } from "node:process";
function main() {
    const cmdObject = {};
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
