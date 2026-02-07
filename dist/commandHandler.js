import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";
export async function handlerLogin(cmdName, ...args) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const name = args[0];
    const user = await getUser(name);
    if (!user) {
        throw new Error("User doesnt exists");
    }
    setUser(args[0]);
    console.log(`The ${name} username has been set`);
}
export async function registerHandler(cmdName, ...args) {
    console.log("DEBUG: registerHandler called with", cmdName, args);
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const name = args[0];
    console.log("DEBUG: about to call getUser with", name);
    const user = await getUser(name);
    console.log("DEBUG: after getUser, user =", user);
    if (user) {
        throw new Error("User already exists.");
    }
    const newUser = await createUser(name);
    setUser(newUser.name);
    console.log(`${name} was created`);
    console.log("DEBUG: newUser =", newUser);
}
