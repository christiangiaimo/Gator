export async function registerCommand(registry, cmdName, handler) {
    registry[cmdName] = handler;
}
export async function runCommand(registry, cmdName, ...args) {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command not found ${cmdName}`);
    }
    await handler(cmdName, ...args);
}
