import { setUser, readConfig, writeConfig } from "./config";

async function main() {
  setUser("Christian");
  const content = readConfig();
  console.log(content);
}

main();
