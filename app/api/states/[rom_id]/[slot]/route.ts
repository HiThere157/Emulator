import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const stateFilePath = path.join(process.cwd(), "data/states");

type Props = {
  params: {
    rom_id: string;
    slot: string;
  };
};

/*
  Params: rom_id, slot
  Response: blob
  Codes: 401, 404
*/
export async function GET(request: NextRequest, { params }: Props) {
  // [Auth] Validate token
  const token = await validateToken(request);
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [Request] Get state path
  const statePath = path.join(stateFilePath, `${token.id}-${params.rom_id}-${params.slot}.state`);

  // [Validation] Check if state file exists
  const stateExists = await fs.stat(statePath).catch(() => false);
  if (!stateExists) {
    return new Response("State not Found", {
      status: 404,
    });
  }

  // [FS] Read state blob
  const blob = await fs.readFile(statePath);

  return new Response(blob, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
    status: 200,
  });
}

/*
  Params: rom_id, slot
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

  // [Validation] Check if state blob is valid
  if (!request.body) {
    return new Response("Invalid state blob", {
      status: 400,
    });
  }

  // [FS] Update state
  const statePath = path.join(stateFilePath, `${token.id}-${params.rom_id}-${params.slot}.state`);
  const state = new Uint8Array(await request.arrayBuffer());
  await fs.writeFile(statePath, state);

  return new Response(null, {
    status: 200,
  });
}
