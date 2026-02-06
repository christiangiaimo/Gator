import { setUser, readConfig } from "./config";
function main() {
    setUser("Christian");
    const content = readConfig();
    console.log(content);
}
main();
