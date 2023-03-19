import path from "path";
import { promises as fs } from "fs";

import { NextRequest } from "next/server";

import { info } from "@/helpers/logging";
import { createDirectory, verifyToken } from "@/helpers/api";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  // check auth (403)
  if (!verifyToken(request)) {
    return new Response(null, { status: 403 });
  }

  const stateDBPath = path.join(process.cwd(), "data/states");
  await createDirectory(stateDBPath);

  const games = await fs.readdir(stateDBPath);
  const states: StateFile[] = [];

  for (const game of games) {
    const stateFiles = await fs.readdir(`${stateDBPath}/${game}`);

    for (const stateFile of stateFiles) {
      const stateStats = await fs.stat(`${stateDBPath}/${game}/${stateFile}`);
      states.push({ game, fileName: stateFile.split(".")[0], size: stateStats.size });
    }
  }

  info("successful GET request for /states");
  return new Response(JSON.stringify(states));
}
