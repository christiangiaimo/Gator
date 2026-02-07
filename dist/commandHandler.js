import { readConfig, setUser } from "./config";
import { createUser, getUser, getUsers, resetUsers, } from "./lib/db/queries/users";
export async function handlerLogin(cmdName, ...args) {
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
export async function registerHandler(cmdName, ...args) {
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
    console.log(`${newUser.createdAt}, ${newUser.id}, ${newUser.name}, ${newUser.updatedAt}`);
}
export async function resetUsersTable(cmdName, ...args) {
    await resetUsers();
    console.log("Users table has been reset.");
}
export async function printUsers() {
    const users = await getUsers();
    const config = readConfig();
    for (const user of users) {
        if (config.currentUserName === user.name) {
            console.log(`${user.name} (current)`);
        }
        else {
            console.log(user.name);
        }
    }
}
