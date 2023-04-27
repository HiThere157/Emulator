import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const romDBPath = path.join(process.cwd(), "data/roms.json");
const romFilePath = path.join(process.cwd(), "data/roms");

type Props = {
  params: {
    id: string;
  };
};

/*
  Params: id
  Response: blob
  Codes: 401, 404
*/
export async function GET(request: NextRequest, { params }: Props) {
  // [Auth] Validate token
  if (!(await validateToken(request))) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [Request] Get rom path
  const romPath = path.join(romFilePath, `${params.id}.rom`);

  // [Validation] Check if rom file exists
  const romExists = await fs.stat(romPath).catch(() => false);
  if (!romExists) {
    return new Response("Rom not found", {
      status: 404,
    });
  }

  // [FS] Read rom blob
  const blob = await fs.readFile(romPath);

  return new Response(blob, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "max-age=43200, s-maxage=86400",
      "CDN-Cache-Control": "max-age=43200",
    },
    status: 200,
  });
}

/*
  Params: id
  Role: Administrator
  Body: blob
  Codes: 400, 401, 403, 404
*/
export async function PUT(request: NextRequest, { params }: Props) {
  // [Auth] Validate token
  const token = await validateToken(request);
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [Auth] Validate role
  if (token.role !== "Administrator") {
    return new Response("Administrator role required", {
      status: 403,
    });
  }

  // [Validation] Check if rom id is valid
  const romDB = await fs.readFile(romDBPath, "utf-8");
  const roms: RomFile[] = JSON.parse(romDB);
  const currentRomIndex = roms.findIndex((rom) => rom.id.toString() === params.id);
  if (currentRomIndex === -1) {
    return new Response("Rom not found", {
      status: 404,
    });
  }

  // [Validation] Check if rom blob is valid
  if (!request.body) {
    return new Response("Rom blob is required", {
      status: 400,
    });
  }

  // [FS] Update rom
  const romPath = path.join(romFilePath, `${params.id}.rom`);
  const rom = new Uint8Array(await request.arrayBuffer());
  await fs.writeFile(romPath, rom);

  // [DB] Update rom database
  roms[currentRomIndex].size = rom.length;
  await fs.writeFile(romDBPath, JSON.stringify(roms, null, 2));

  return new Response(null, {
    status: 200,
  });
}
