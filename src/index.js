import os from "os";
import readline from "readline";
import { FileManager } from "./fileManager.js";
import { decodeAndExecute } from "./decodeAndExecute.js";

const username = process.argv.slice(2)[0].slice(11);
const homedir = os.homedir();

const fileManager = new FileManager(username, homedir);

fileManager.onStart();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (command) => {
  decodeAndExecute(command, fileManager, rl);
});

rl.on("close", () => {
  fileManager.goodbye();
});
