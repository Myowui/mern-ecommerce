// Tiny "database": each collection is a JSON file inside the data/ folder.
// readData("users") -> array of users, writeData("users", array) -> saves it back.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = (name) => path.join(__dirname, "data", `${name}.json`);

export function readData(name) {
  try {
    return JSON.parse(fs.readFileSync(filePath(name), "utf-8"));
  } catch {
    // file missing or empty -> start with an empty list
    return [];
  }
}

export function writeData(name, data) {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}
