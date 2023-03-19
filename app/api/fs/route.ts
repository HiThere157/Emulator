import path from "path";
import { promises as fs } from "fs";

import { info } from "@/helpers/logging";

export const revalidate = 0;

async function getDirectorySize(directoryPath: string): Promise<number> {
  let totalSize = 0;
  const files = await fs.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      totalSize += await getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

export async function GET() {
  const romDBPath = path.join(process.cwd(), "data/roms");
  const stateDBPath = path.join(process.cwd(), "data/states");

  const romsSize = await getDirectorySize(romDBPath);
  const statesSize = await getDirectorySize(stateDBPath);

  const result: DiskUsage = {
    roms: romsSize,
    states: statesSize,
  };

  console.log(result);

  info("successful GET request for /fs");
  return new Response(JSON.stringify(result));
}
