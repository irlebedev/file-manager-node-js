import { createHash } from "crypto";
import { createReadStream, createWriteStream } from "fs";
import * as fs from "fs/promises";
import os from "os";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { osInfo } from "./osInfo.js";

export class FileManager {
  /**
   * @param {string} username
   * @param {string} homedir
   */
  constructor(username, homedir) {
    this.username = username;
    this.homedir = homedir;
  }

  /**
   * @type {string}
   */
  currentLocation;
  #initiated = false;
  EOL = os.EOL;
  sep = path.sep;

  onStart = () => {
    this.changeDir(this.homedir);
    this.greetings();
    this.showCurrentDir();
    this.#initiated = true;
  };

  goodbye = () => {
    console.log(`Thank you for using File Manager, ${this.username}!`);
  };

  greetings = () => {
    console.log(`Welcome to the File Manager, ${this.username}!`);
  };

  showCurrentDir = () => {
    console.log(`You are currently in ${this.currentLocation}${this.EOL}`);
  };

  showInvalidInput = () => {
    console.log(`Invalid input!${this.EOL}`);
    this.showCurrentDir();
  };

  showOperationFailed = () => {
    console.log(`Operation failed!${this.EOL}`);
    this.showCurrentDir();
  };

  /**
   *
   * @param {string} dir
   */
  changeDir = (dir) => {
    try {
      process.chdir(dir);
      this.currentLocation = process.cwd();
      if (this.#initiated) {
        this.showCurrentDir();
      }
    } catch (error) {
      this.showOperationFailed();
    }
  };

  getList = async () => {
    try {
      const list = await fs.readdir(this.currentLocation);
      console.log(list);
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {import("fs").PathLike} pathToFile
   */
  readAndPrint = async (pathToFile) => {
    try {
      const readStream = createReadStream(pathToFile);
      readStream.pipe(process.stdout);
      readStream.on("end", () => {
        console.log(this.EOL);
        this.showCurrentDir();
      });
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {string} fileName
   */
  createEmptyFile = async (fileName) => {
    try {
      const filePath = `${this.currentLocation}${this.sep}${fileName}`;
      await fs.open(filePath, "wx");
      console.log("File created!");
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {string} oldFileName
   * @param {string} newFileName
   */
  renameFile = async (oldFileName, newFileName) => {
    try {
      const oldFilePath = `${this.currentLocation}${this.sep}${oldFileName}`;
      const newFilePath = `${this.currentLocation}${this.sep}${newFileName}`;
      await fs.rename(oldFilePath, newFilePath);
      console.log("File renamed!");
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {import("fs").PathLike} sourcePath
   * @param {import("fs").PathLike} destinationPath
   */
  copyFile = async (sourcePath, destinationPath) => {
    try {
      const readStream = createReadStream(sourcePath);
      const writeStream = createWriteStream(destinationPath);
      readStream.pipe(writeStream);
      readStream.on("end", () => {
        console.log(this.EOL);
        console.log("File copied!");
        this.showCurrentDir();
      });
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {import("fs").PathLike} sourcePath
   * @param {import("fs").PathLike} destinationPath
   */
  moveFile = async (sourcePath, destinationPath) => {
    try {
      await fs.rename(sourcePath, destinationPath);
      console.log("File moved!");
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {import("fs").PathLike} filePath
   */
  deleteFile = async (filePath) => {
    try {
      await fs.rm(filePath);
      console.log("File deleted!");
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {string} parameter
   */
  getOsInfo = (parameter) => {
    if (!osInfo[parameter]) {
      return this.showInvalidInput();
    }
    console.log(osInfo[parameter]);
    this.showCurrentDir();
  };

  /**
   *
   * @param {import("fs").PathLike} filePath
   */
  getHash = async (filePath) => {
    const hash = createHash("sha256", { encoding: "hex" });
    const readStream = createReadStream(filePath);
    readStream.pipe(hash).setEncoding("hex").pipe(process.stdout);
    readStream.on("end", () => {
      console.log(this.EOL);
      this.showCurrentDir();
    });
    readStream.on("error", () => {
      this.showOperationFailed();
    });
  };

  /**
   *
   * @param {import("fs").PathLike} sourcePath
   * @param {import("fs").PathLike} destinationPath
   */
  compressFile = async (sourcePath, destinationPath) => {
    try {
      const pipe = promisify(pipeline);
      const readStream = createReadStream(sourcePath);
      const writeStream = createWriteStream(destinationPath);
      const brotliCompress = createBrotliCompress();
      await pipe(readStream, brotliCompress, writeStream);
      console.log(this.EOL);
      console.log("File compressed!");
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };

  /**
   *
   * @param {import("fs").PathLike} sourcePath
   * @param {import("fs").PathLike} destinationPath
   */
  decompressFile = async (sourcePath, destinationPath) => {
    try {
      const pipe = promisify(pipeline);
      const readStream = createReadStream(sourcePath);
      const writeStream = createWriteStream(destinationPath);
      const brotliDecompress = createBrotliDecompress();
      await pipe(readStream, brotliDecompress, writeStream);
      console.log(this.EOL);
      console.log("File decompressed!");
      this.showCurrentDir();
    } catch (error) {
      this.showOperationFailed();
    }
  };
}
