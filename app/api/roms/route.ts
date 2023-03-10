import path from "path";
import { promises as fs } from "fs";

import { cores } from "@/config/cores";
import { getRomPath, createDirectory, exists } from "@/helpers/api";

export const revalidate = 0;

async function getDB() {
  const romDBPath = path.join(process.cwd(), "data/roms.json");
  const romDB: RomFile[] = JSON.parse(await fs.readFile(romDBPath, { encoding: "utf-8" }));
  return { romDBPath, romDB };
}

export async function GET() {
  const { romDB } = await getDB();
  return new Response(JSON.stringify(romDB));
}

export async function POST(request: Request) {
  const { romDB, romDBPath } = await getDB();
  const newRom: RomFile = await request.json();

  // basic input check
  // check for duplicates
  if (
    !(newRom.friendlyName && newRom.fileName) ||
    !Object.keys(cores).includes(newRom.core) ||
    romDB.some((romFile) => {
      return romFile.fileName === newRom.fileName && romFile.core === newRom.core;
    })
  ) {
    return new Response(null, { status: 400 });
  }

  romDB.push(newRom);

  await fs.writeFile(romDBPath, JSON.stringify(romDB), { encoding: "utf-8" });
  return new Response();
}

export async function PATCH(request: Request) {
  const { romDB, romDBPath } = await getDB();
  const romChange: RomFileChange = await request.json();

  // basic input check
  // check for duplicates
  if (
    !romChange.fileName ||
    !Object.keys(cores).includes(romChange.core) ||
    !Object.keys(cores).includes(romChange.targetCore) ||
    romDB.some((romFile) => {
      return romFile.fileName === romChange.fileName && romFile.core === romChange.targetCore;
    })
  ) {
    return new Response(null, { status: 400 });
  }

  const romPath = getRomPath(romChange.core, romChange.fileName);
  const targetRomPath = getRomPath(romChange.targetCore, romChange.fileName);

  // check existance in DB
  const currentRom = romDB.find((romFile) => {
    return romFile.fileName === romChange.fileName && romFile.core === romChange.core;
  });
  if (!currentRom) {
    return new Response(null, { status: 400 });
  }

  if (!(await exists(romPath)) || (await exists(targetRomPath))) {
    return new Response(null, { status: 400 });
  }

  // path traversal should not be possible, since the core is whitelisted
  await createDirectory(`data/roms/${romChange.targetCore}`);

  currentRom.core = romChange.targetCore;
  await fs.writeFile(romDBPath, JSON.stringify(romDB), { encoding: "utf-8" });
  await fs.rename(romPath, targetRomPath);
  return new Response();
}
