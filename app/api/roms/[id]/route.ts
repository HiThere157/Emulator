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
  Role: Administrator
  Body: RomFileCR
  Response: RomFile
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

  // [Request] Get rom details
  const { name, core, image, image_resolution }: RomFileCR = await request.json();

  // [Validation] Check for missing fields
  if (!name || !core || !image_resolution) {
    return new Response("Missing fields", {
      status: 400,
    });
  }

  // [DB] Read roms
  const romDB = await fs.readFile(romDBPath, "utf-8");
  const roms: RomFile[] = JSON.parse(romDB);

  // [DB] Update rom (1/2 - Create new rom)
  const newRom: RomFileCR = {
    name,
    core,
    image,
    image_resolution,
  };
  const currentRomIndex = roms.findIndex((rom) => rom.id.toString() === params.id);

  // [Validation] Check if rom exists
  if (currentRomIndex === -1) {
    return new Response("Rom not found", {
      status: 404,
    });
  }

  // [DB] Update rom (2/2 - Update roms)
  roms[currentRomIndex] = { ...roms[currentRomIndex], ...newRom };

  // [DB] Write roms
  await fs.writeFile(romDBPath, JSON.stringify(roms, null, 2));

  return new Response(JSON.stringify(roms[currentRomIndex]), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

/*
  Params: id
  Role: Administrator
  Codes: 401, 403, 404
*/
export async function DELETE(request: NextRequest, { params }: Props) {
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

  // [DB] Read roms
  const romDB = await fs.readFile(romDBPath, "utf-8");
  const roms: RomFile[] = JSON.parse(romDB);

  // [DB] Delete rom (1/2 - Find rom)
  const currentRomIndex = roms.findIndex((rom) => rom.id.toString() === params.id);

  // [Validation] Check if rom exists
  if (currentRomIndex === -1) {
    return new Response("Rom not found", {
      status: 404,
    });
  }

  // [DB] Delete rom (2/2 - Delete rom)
  roms.splice(currentRomIndex, 1);
  await fs.writeFile(romDBPath, JSON.stringify(roms, null, 2));

  // [FS] Delete rom file
  try {
    await fs.unlink(path.join(romFilePath, `${params.id}.rom`));
  } catch {}

  return new Response(null, {
    status: 200,
  });
}
