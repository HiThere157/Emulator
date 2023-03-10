import path from "path";
import { promises as fs } from "fs";

import { cores } from "@/config/cores";

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
