import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const stateFilePath = path.join(process.cwd(), "data/states");

/*
  Response: StateFile[]
  Codes: 401
*/
export async function GET(request: NextRequest) {
  // [Auth] Validate token
  const token = await validateToken(request);
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [FS] Read states
  const stateFiles = await fs.readdir(stateFilePath);
  const states: StateFile[] = await Promise.all(
    stateFiles.map(async (stateFile) => {
      const [user_id, rom_id, slot] = stateFile.split("-");
      const stats = await fs.stat(path.join(stateFilePath, stateFile));

      return {
        rom_id: parseInt(rom_id),
        slot: parseInt(slot),
        user_id: parseInt(user_id),
        size: stats.size,
      };
    }),
  );

  return new Response(JSON.stringify(states), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
