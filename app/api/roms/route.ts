import path from "path";
import { promises as fs } from "fs";

import { info } from "@/helpers/logging";
import { createDirectory } from "@/helpers/api";

export const revalidate = 0;

export async function GET() {
  const romDBPath = path.join(process.cwd(), "data/roms");
  await createDirectory(romDBPath);

  const cores = await fs.readdir(romDBPath);
  const roms: RomFile[] = [];

  for (const core of cores) {
    const romFiles = await fs.readdir(`${romDBPath}/${core}`);

    for (const romFile of romFiles) {
      const romStats = await fs.stat(`${romDBPath}/${core}/${romFile}`);
      roms.push({ core, fileName: romFile.split(".")[0], size: romStats.size });
    }
  }

  info("successful GET request for /roms");
  return new Response(JSON.stringify(roms));
}
