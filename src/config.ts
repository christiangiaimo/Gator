import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName?: string;
};

export function setUser(name: string) {
  const config = readConfig();
  const new_config = {
    dbUrl: config.dbUrl,
    currentUserName: name,
  };
  writeConfig(new_config);
}

function getConfigFilePath(): string {
  const userHomeDir: string = os.homedir();
  const fileName = "/.gatorconfig.json";
  return path.join(process.cwd(), ".gatorconfig.json");
}

export function readConfig(): Config {
  const path: string = getConfigFilePath();
  const content = fs.readFileSync(path, "utf-8");
  const object = JSON.parse(content);
  return validateConfig(object);
}

export function writeConfig(cfg: Config): void {
  const raw = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const text = JSON.stringify(raw);
  fs.writeFileSync(getConfigFilePath(), text, "utf-8");
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("invalid db_url");
  }
  const cfg: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName:
      typeof rawConfig.current_user_name === "string"
        ? rawConfig.current_user_name
        : undefined,
  };

  return cfg;
}
