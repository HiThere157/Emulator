import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

const dataPath = path.join(process.cwd(), "data");
const userDBPath = path.join(process.cwd(), "data/users.json");
const romDBPath = path.join(process.cwd(), "data/roms.json");
const romFilePath = path.join(process.cwd(), "data/roms");
const stateFilePath = path.join(process.cwd(), "data/states");
const authConfigPath = path.join(process.cwd(), "data/auth.json");

async function exists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

export default async function init() {
  if (!(await exists(dataPath))) {
    await fs.mkdir(dataPath);
  }

  // [DB] create user DB if it doesn't exist
  if (!(await exists(userDBPath))) {
    await fs.writeFile(userDBPath, JSON.stringify([]));
  }

  // [DB] create rom DB if it doesn't exist
  if (!(await exists(romDBPath))) {
    await fs.writeFile(romDBPath, JSON.stringify([]));
  }

  // [FS] create rom folder if it doesn't exist
  if (!(await exists(romFilePath))) {
    await fs.mkdir(romFilePath);
  }

  // [FS] create state folder if it doesn't exist
  if (!(await exists(stateFilePath))) {
    await fs.mkdir(stateFilePath);
  }

  // [DB] create auth config if it doesn't exist
  if (!(await exists(authConfigPath))) {
    await fs.writeFile(
      authConfigPath,
      JSON.stringify(
        {
          secret: crypto.randomBytes(64).toString("hex"),
          canLogin: true,
          canRegister: true,
          maxUsers: 50,
        } as AuthConfig,
        null,
        2,
      ),
    );
  }
}
