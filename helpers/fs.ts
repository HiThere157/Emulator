import { promises as fs } from "fs";

async function createDirectory(path: string) {
  try {
    await fs.mkdir(path);
  } catch (error) {
    console.warn(error);
  }
}

async function exists(path: string) {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export { createDirectory, exists };
