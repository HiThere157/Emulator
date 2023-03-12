import { promises as fs } from "fs";

import { NextRequest } from "next/server";
import { createDirectory, exists, getBody, getRomPath, verifyToken, isCore } from "@/helpers/api";

export const revalidate = 0;

type Props = {
  params: {
    core: string;
    fileName: string;
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  const fileBlob = await fs.readFile(getRomPath(params.core, params.fileName));
  return new Response(fileBlob);
}

export async function POST(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    return new Response(null, { status: 403 });
  }

  // verify core uri prop (400)
  if (!isCore(params.core)) {
    return new Response(null, { status: 400 });
  }

  // verify fileName uri prop (400)
  const romPath = getRomPath(params.core, params.fileName);
  if (await exists(romPath)) {
    return new Response(null, { status: 400 });
  }

  const fileBuffer = new Uint8Array(await request.arrayBuffer());
  await createDirectory(`data/roms/${params.core}`);
  await fs.writeFile(romPath, fileBuffer);
  return new Response();
}

export async function PATCH(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    return new Response(null, { status: 403 });
  }

  // verify body and body props (400)
  // verify core uri prop (400)
  const body: { targetCore: string } | undefined = await getBody(request);
  if (!body || !body.targetCore || !isCore(body.targetCore) || !isCore(params.core)) {
    return new Response(null, { status: 400 });
  }

  // verify fileName uri prop (400)
  const romPath = getRomPath(params.core, params.fileName);
  const targetRomPath = getRomPath(body.targetCore, params.fileName);
  if ((await exists(targetRomPath)) || !(await exists(romPath))) {
    return new Response(null, { status: 400 });
  }

  await createDirectory(`data/roms/${body.targetCore}`);
  await fs.rename(romPath, targetRomPath);
  return new Response();
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    return new Response(null, { status: 403 });
  }

  // verify core uri prop (400)
  if (!isCore(params.core)) {
    return new Response(null, { status: 400 });
  }

  // verify fileName uri prop (400)
  const romPath = getRomPath(params.core, params.fileName);
  if (!(await exists(romPath))) {
    return new Response(null, { status: 400 });
  }

  await fs.unlink(romPath);
  return new Response();
}
