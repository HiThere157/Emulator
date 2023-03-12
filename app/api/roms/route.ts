import path from "path";
import { promises as fs } from "fs";

import { createDirectory } from "@/helpers/api";
import { makeFriendlyName } from "@/helpers/upload";

export const revalidate = 0;

export async function GET() {
  const romDBPath = path.join(process.cwd(), "data/roms");
  await createDirectory(romDBPath);

  const folders = await fs.readdir(romDBPath);
  const roms: RomFile[] = [];

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];

    const files = await fs.readdir(`${romDBPath}/${folder}`);
    files.forEach((file) => {
      roms.push({
        core: folder,
        fileName: file,
        friendlyName: makeFriendlyName(file),
      });
    });
  }

  return new Response(JSON.stringify(roms));
}
