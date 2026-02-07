import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
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

export async function registerHandler(cmdName: string, ...args: string[]) {
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
  console.log(
    `${newUser.createdAt}, ${newUser.id}, ${newUser.name}, ${newUser.updatedAt}`,
  );
}
