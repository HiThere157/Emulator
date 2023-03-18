import path from "path";
import { promises as fs } from "fs";

import { createDirectory } from "@/helpers/api";

export const revalidate = 0;

export async function GET() {
  const stateDBPath = path.join(process.cwd(), "data/states");
  await createDirectory(stateDBPath);

  const games = await fs.readdir(stateDBPath);
  const roms: StateFile[] = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    const files = await fs.readdir(`${stateDBPath}/${game}`);
    files.forEach((fileName) => {
      roms.push({ game, fileName: fileName.split(".")[0] });
    });
  }

  return new Response(JSON.stringify(roms));
}
