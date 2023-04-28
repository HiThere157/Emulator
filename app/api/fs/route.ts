import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const romFilePath = path.join(process.cwd(), "data/roms");
const stateFilePath = path.join(process.cwd(), "data/states");

/*
  Response: File[]
  Codes: 401
*/
export async function GET(request: NextRequest) {
  // [Auth] Validate token
  if (!(await validateToken(request))) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [FS] Read Rom files
  const romFiles = await fs.readdir(romFilePath);
  const roms = await Promise.all(
    romFiles.map(async (file) => {
      const stats = await fs.stat(path.join(romFilePath, file));
      return {
        name: file,
        type: "rom",
        size: stats.size,
      };
    }),
  );

  // [FS] Read State files
  const stateFiles = await fs.readdir(stateFilePath);
  const states = await Promise.all(
    stateFiles.map(async (file) => {
      const stats = await fs.stat(path.join(stateFilePath, file));
      return {
        name: file,
        type: "state",
        size: stats.size,
      };
    }),
  );

  return new Response(JSON.stringify([...roms, ...states]), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
