import { promises as fs } from "fs";

import { NextRequest } from "next/server";

import { info, warn } from "@/helpers/logging";
import { createDirectory, exists, getBody, sanitizePath, verifyToken, isCore } from "@/helpers/api";

export const revalidate = 0;

type Props = {
  params: {
    core: string;
    fileName: string;
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  const fileBlob = await fs.readFile(
    sanitizePath("data/roms/", `${params.core}/${params.fileName}.rom`),
  );

  info(`successful GET request for /rom/${params.core}/${params.fileName}`);
  return new Response(fileBlob, { headers: [["Cache-Control", "max-age=21600"]] });
}

export async function POST(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized POST request for /rom/${params.core}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  // verify core uri prop (400)
  if (!isCore(params.core)) {
    warn(`invalid POST request for /rom/${params.core}/${params.fileName}, invalid core`);
    return new Response(null, { status: 400 });
  }

  // verify fileName uri prop (400)
  const romPath = sanitizePath("data/roms/", `${params.core}/${params.fileName}.rom`);
  if (await exists(romPath)) {
    warn(`invalid POST request for /rom/${params.core}/${params.fileName}, file already exists`);
    return new Response(null, { status: 400 });
  }

  const fileBuffer = new Uint8Array(await request.arrayBuffer());
  await createDirectory(`data/roms/${params.core}`);
  await fs.writeFile(romPath, fileBuffer);

  info(`successful POST request for /rom/${params.core}/${params.fileName}, file added`);
  return new Response();
}

export async function PATCH(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized PATCH request for /rom/${params.core}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  // verify body and body props (400)
  // verify core uri prop (400)
  const body: { targetCore: string } | undefined = await getBody(request);
  if (!body || !body.targetCore || !isCore(body.targetCore)) {
    warn(`invalid PATCH request for /rom/${params.core}/${params.fileName}, invalid core(s)`);
    return new Response(null, { status: 400 });
  }

  // verify fileName uri prop (400)
  const romPath = sanitizePath("data/roms/", `${params.core}/${params.fileName}.rom`);
  const targetRomPath = sanitizePath("data/roms/", `${body.targetCore}/${params.fileName}.rom`);
  if ((await exists(targetRomPath)) || !(await exists(romPath))) {
    warn(`invalid PATCH request for /rom/${params.core}/${params.fileName}, invalid fileName`);
    return new Response(null, { status: 400 });
  }

  await createDirectory(`data/roms/${body.targetCore}`);
  await fs.rename(romPath, targetRomPath);

  info(
    `successful PATCH request for /rom/${params.core}/${params.fileName}, file moved to "${body.targetCore}"`,
  );
  return new Response();
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized DELETE request for /rom/${params.core}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  // verify fileName uri prop (400)
  const romPath = sanitizePath("data/roms/", `${params.core}/${params.fileName}.rom`);
  if (!(await exists(romPath))) {
    warn(`invalid DELETE request for /rom/${params.core}/${params.fileName}, invalid fileName`);
    return new Response(null, { status: 400 });
  }

  const statePath = sanitizePath("data/states/", `${params.fileName}`);
  if (await exists(statePath)) {
    await fs.rm(statePath, { recursive: true });
  }

  await fs.rm(romPath);

  info(`successful DELETE request for /rom/${params.core}/${params.fileName}, file deleted`);
  return new Response();
}
