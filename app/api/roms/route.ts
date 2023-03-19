import path from "path";
import { promises as fs } from "fs";

import { createDirectory } from "@/helpers/api";

export const revalidate = 0;

export async function GET() {
  const romDBPath = path.join(process.cwd(), "data/roms");
  await createDirectory(romDBPath);

  const cores = await fs.readdir(romDBPath);
  const roms: RomFile[] = [];

  for (let i = 0; i < cores.length; i++) {
    const core = cores[i];
    const romFiles = await fs.readdir(`${romDBPath}/${core}`);

    for (let j = 0; j < romFiles.length; j++) {
      const romFile = romFiles[j];
      const romStats = await fs.stat(`${romDBPath}/${core}/${romFile}`);

      roms.push({ core, fileName: romFile.split(".")[0], size: romStats.size });
    }
  }

  return new Response(JSON.stringify(roms));
}
