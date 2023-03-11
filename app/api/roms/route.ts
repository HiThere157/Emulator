import path from "path";
import { promises as fs } from "fs";

export const revalidate = 0;

export async function GET() {
  const romDBPath = path.join(process.cwd(), "data/roms");

  const folders = await fs.readdir(romDBPath);
  const roms: RomFile[] = [];

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];

    const files = await fs.readdir(`${romDBPath}/${folder}`);
    files.forEach((file) => {
      roms.push({
        fileName: file,
        core: folder,
      });
    });
  }

  return new Response(JSON.stringify(roms));
}
