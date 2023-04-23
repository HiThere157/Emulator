import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const romDBPath = path.join(process.cwd(), "data/roms.json");

/*
  Response: RomFile[]
  Codes: 401
*/
export async function GET(request: NextRequest) {
  // [Auth] Validate token
  if (!(await validateToken(request))) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [DB] Read roms
  const romDB = await fs.readFile(romDBPath, "utf-8");
  const roms: RomFile[] = JSON.parse(romDB);

  return new Response(JSON.stringify(roms), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

/*
  Role: Administrator
  Body: RomFileCR
  Response: RomFile
  Codes: 400, 401, 403
*/
export async function POST(request: NextRequest) {
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

  // [Request] Get rom details
  const { name, core, image, image_resolution }: RomFileCR = await request.json();

  // [Validation] Check for missing fields
  if (!name || !core || !image_resolution) {
    return new Response("Missing fields", {
      status: 400,
    });
  }

  // [DB] Create rom
  const rom: RomFile = {
    id: new Date().getTime(),
    name,
    core,
    image,
    image_resolution,
    uploaded_by: token.id,
    size: 0,
  };
  roms.push(rom);
  await fs.writeFile(romDBPath, JSON.stringify(roms, null, 2));

  return new Response(JSON.stringify(rom), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
