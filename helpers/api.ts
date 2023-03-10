import path from "path";
import { promises as fs } from "fs";

function getRomPath(core: string, fileName: string) {
  const unsafePath = `data/roms/${core}/${fileName}`;
  const safePath = path.normalize(unsafePath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(process.cwd(), safePath);
}

async function createDirectory(path: string) {
  if (!(await exists(path))) {
    await fs.mkdir(path);
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

export { getRomPath, createDirectory, exists };
