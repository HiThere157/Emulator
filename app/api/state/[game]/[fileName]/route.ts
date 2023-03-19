import { promises as fs } from "fs";

import { NextRequest } from "next/server";

import { info, warn } from "@/helpers/logging";
import { createDirectory, exists, getBody, sanitizePath, verifyToken } from "@/helpers/api";

export const revalidate = 0;

type Props = {
  params: {
    game: string;
    fileName: string;
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized GET request for /state/${params.game}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  const fileBlob = await fs.readFile(
    sanitizePath("data/states/", `${params.game}/${params.fileName}.state`),
  );
  info(`successful GET request for /state/${params.game}/${params.fileName}`);
  return new Response(fileBlob);
}

export async function POST(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized POST request for /state/${params.game}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  // verify game and fileName uri prop (400)
  const statePath = sanitizePath("data/states/", `${params.game}/${params.fileName}.state`);
  if (await exists(statePath)) {
    warn(`invalid POST request for /state/${params.game}/${params.fileName}, file already exists`);
    return new Response(null, { status: 400 });
  }

  const fileBuffer = new Uint8Array(await request.arrayBuffer());
  await createDirectory(`data/states/${params.game}`);
  await fs.writeFile(statePath, fileBuffer);

  info(`successful POST request for /state/${params.game}/${params.fileName}, file added`);
  return new Response();
}

export async function PATCH(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized PATCH request for /state/${params.game}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  // verify body and body props (400)
  const body: { targetFileName: string } | undefined = await getBody(request);
  if (!body || !body.targetFileName) {
    warn(
      `invalid PATCH request for /state/${params.game}/${params.fileName}, invalid targetFileName`,
    );
    return new Response(null, { status: 400 });
  }

  // verify fileName uri prop (400)
  const statePath = sanitizePath("data/states/", `${params.game}/${params.fileName}.state`);
  const targetStatePath = sanitizePath(
    "data/states/",
    `${params.game}/${body.targetFileName}.state`,
  );
  if ((await exists(targetStatePath)) || !(await exists(statePath))) {
    warn(`invalid PATCH request for /states/${params.game}/${params.fileName}, invalid fileName`);
    return new Response(null, { status: 400 });
  }

  await fs.rename(statePath, targetStatePath);

  info(
    `successful PATCH request for /states/${params.game}/${params.fileName}, file renamed to "${body.targetFileName}"`,
  );
  return new Response();
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    warn(`unauthorized DELETE request for /state/${params.game}/${params.fileName}`);
    return new Response(null, { status: 403 });
  }

  // verify game and fileName uri prop (400)
  const statePath = sanitizePath("data/states/", `${params.game}/${params.fileName}.state`);
  if (!(await exists(statePath))) {
    warn(`invalid DELETE request for /state/${params.game}/${params.fileName}, invalid fileName`);
    return new Response(null, { status: 400 });
  }

  await fs.rm(statePath);
  info(`successful DELETE request for /state/${params.game}/${params.fileName}, file deleted`);
  return new Response();
}
