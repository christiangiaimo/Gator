import type { CommandHandler } from "./commandHandler";

export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command not found ${cmdName}`);
  }
  handler(cmdName, ...args);
}
