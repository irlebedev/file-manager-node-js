import path from "path";
import { commands } from "./constants.js";
import { getCommandArguments, isInputContainsCommand } from "./utils.js";

/**
 *
 * @param {string} inputCommand
 * @param {import("./fileManager.js").FileManager} fileManager
 * @param {import("readline").Interface} rl
 */
export const decodeAndExecute = (inputCommand, fileManager, rl) => {
  if (commands.goUpper.includes(inputCommand)) {
    return fileManager.changeDir("..");
  }
  if (commands.exit.includes(inputCommand)) {
    rl.emit("close");
    return process.exit();
  }
  if (commands.list.includes(inputCommand)) {
    return fileManager.getList();
  }
  if (isInputContainsCommand(inputCommand, commands.changeDir)) {
    const [dirName] = getCommandArguments(inputCommand);
    return fileManager.changeDir(
      `${fileManager.currentLocation}${path.sep}${dirName}`
    );
  }
  if (isInputContainsCommand(inputCommand, commands.readAndPrint)) {
    const [filePath] = getCommandArguments(inputCommand);
    return fileManager.readAndPrint(filePath);
  }
  if (isInputContainsCommand(inputCommand, commands.createEmptyFile)) {
    const [fileName] = getCommandArguments(inputCommand);
    return fileManager.createEmptyFile(fileName);
  }
  if (isInputContainsCommand(inputCommand, commands.renameFile)) {
    const [oldFileName, newFileName] = getCommandArguments(inputCommand);
    return fileManager.renameFile(oldFileName, newFileName);
  }
  if (isInputContainsCommand(inputCommand, commands.copyFile)) {
    const [pathToFile, pathToNewDirectory] = getCommandArguments(inputCommand);
    return fileManager.copyFile(pathToFile, pathToNewDirectory);
  }
  if (isInputContainsCommand(inputCommand, commands.moveFile)) {
    const [pathToFile, pathToNewDirectory] = getCommandArguments(inputCommand);
    return fileManager.moveFile(pathToFile, pathToNewDirectory);
  }
  if (isInputContainsCommand(inputCommand, commands.deleteFile)) {
    const [pathToFile] = getCommandArguments(inputCommand);
    return fileManager.deleteFile(pathToFile);
  }
  if (isInputContainsCommand(inputCommand, commands.osInfo)) {
    const [parameter] = getCommandArguments(inputCommand);
    return fileManager.getOsInfo(parameter);
  }
  if (isInputContainsCommand(inputCommand, commands.hash)) {
    const [pathToFile] = getCommandArguments(inputCommand);
    return fileManager.getHash(pathToFile);
  }
  if (isInputContainsCommand(inputCommand, commands.compress)) {
    const [sourcePath, destinationPath] = getCommandArguments(inputCommand);
    return fileManager.compressFile(sourcePath, destinationPath);
  }
  if (isInputContainsCommand(inputCommand, commands.decompress)) {
    const [sourcePath, destinationPath] = getCommandArguments(inputCommand);
    return fileManager.decompressFile(sourcePath, destinationPath);
  } else {
    return fileManager.showInvalidInput();
  }
};
