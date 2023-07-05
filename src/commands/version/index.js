import { readJSONFile } from "../../utils/readJson.js";
import { banner } from "../../utils/banner.js";

export async function command_version() {
    console.log("");
    banner("MS BACKEND");
    console.log(`
    MS BACKEND CLI: ${readJSONFile('package.json').version}
    Node: ${process.version}
    `);
}