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

    const files = await fs.readdir(`${romDBPath}/${core}`);
    files.forEach((fileName) => {
      roms.push({ core, fileName });
    });
  }

  return new Response(JSON.stringify(roms));
}
