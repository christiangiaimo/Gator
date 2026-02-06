export function registerCommand(registry, cmdName, handler) {
    registry.commands[cmdName] = handler;
}
export function runCommand(registry, cmdName, ...args) {
    const handler = registry.commands[cmdName];
    if (!handler) {
        throw new Error(`Command ${cmdName} not found`);
    }
    handler(cmdName, ...args);
}
