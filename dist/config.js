import fs from "fs";
import os from "os";
import path from "path";
export function setUser(name) {
    const config = readConfig();
    const new_config = {
        dbUrl: config.dbUrl,
        currentUserName: name,
    };
    writeConfig(new_config);
}
export function getConfigFilePath() {
    const userHomeDir = os.homedir();
    const fileName = "/.gatorconfig.json";
    return path.join(process.cwd(), ".gatorconfig.json");
}
export function readConfig() {
    const path = getConfigFilePath();
    const content = fs.readFileSync(path, "utf-8");
    const object = JSON.parse(content);
    return validateConfig(object);
}
export function writeConfig(cfg) {
    const raw = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    };
    const text = JSON.stringify(raw);
    fs.writeFileSync(getConfigFilePath(), text, "utf-8");
}
function validateConfig(rawConfig) {
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("invalid db_url");
    }
    const cfg = {
        dbUrl: rawConfig.db_url,
        currentUserName: typeof rawConfig.current_user_name === "string"
            ? rawConfig.current_user_name
            : undefined,
    };
    return cfg;
}
