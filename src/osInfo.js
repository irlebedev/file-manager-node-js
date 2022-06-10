import os from "os";

export const osInfo = {
  ["--EOL"]: JSON.stringify(os.EOL),
  ["--cpus"]: os.cpus(),
  ["--homedir"]: os.homedir(),
  ["--username"]: os.userInfo().username,
  ["--architecture"]: os.arch(),
};
