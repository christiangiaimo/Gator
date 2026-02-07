import { setUser, readConfig } from "./config";
async function main() {
    setUser("Christian");
    const content = readConfig();
    console.log(content);
}
main();
