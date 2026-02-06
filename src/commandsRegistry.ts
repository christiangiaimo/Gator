import type { CommandHandler } from "./commandHandler";

type CommandRegistry = {
  commands: {
    [name: string]: CommandHandler;
  };
};

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry.commands[cmdName] = handler;
}

export function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry.commands[cmdName];
  if (!handler) {
    throw new Error(`Command ${cmdName} not found`);
  }
  handler(cmdName, ...args);
}
