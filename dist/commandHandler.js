import { setUser } from "./config";
export function handlerLogin(cmdName, ...args) {
    if (args.length <= 1) {
        console.log("the login handler expects a single argument, the username.");
        process.exit(1);
    }
    setUser(args[1]);
    console.log(`The ${args[1]} username has been set`);
}
