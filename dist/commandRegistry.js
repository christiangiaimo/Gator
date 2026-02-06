export function registerCommand(registry, cmdName, handler) {
    registry[cmdName] = handler;
}
export function runCommand(registry, cmdName, ...args) {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command not found ${cmdName}`);
    }
    handler(cmdName, ...args);
}
