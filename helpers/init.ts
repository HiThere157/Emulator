import path from "path";
import { promises as fs } from "fs";

const dataPath = path.join(process.cwd(), "data");
const userDBPath = path.join(process.cwd(), "data/users.json");
const romDBPath = path.join(process.cwd(), "data/roms.json");
const romFilePath = path.join(process.cwd(), "data/roms");
const stateFilePath = path.join(process.cwd(), "data/states");

async function exists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

export default async function init() {
  if(!await exists(dataPath)) {
    await fs.mkdir(dataPath);
  }

  if(!await exists(userDBPath)) {
    await fs.writeFile(userDBPath, JSON.stringify([]));
  }

  if(!await exists(romDBPath)) {
    await fs.writeFile(romDBPath, JSON.stringify([]));
  }

  if(!await exists(romFilePath)) {
    await fs.mkdir(romFilePath);
  }

  if(!await exists(stateFilePath)) {
    await fs.mkdir(stateFilePath);
  }
}
