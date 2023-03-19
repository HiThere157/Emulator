import { promises as fs } from "fs";

import { NextRequest } from "next/server";
import { createDirectory, exists, sanitizePath, verifyToken } from "@/helpers/api";

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
    return new Response(null, { status: 403 });
  }

  const fileBlob = await fs.readFile(
    sanitizePath("data/states/", `${params.game}/${params.fileName}.state`),
  );
  return new Response(fileBlob);
}

export async function POST(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    return new Response(null, { status: 403 });
  }

  // verify game and fileName uri prop (400)
  const statePath = sanitizePath("data/states/", `${params.game}/${params.fileName}.state`);
  if (await exists(statePath)) {
    return new Response(null, { status: 400 });
  }

  const fileBuffer = new Uint8Array(await request.arrayBuffer());
  await createDirectory(`data/states/${params.game}`);
  await fs.writeFile(statePath, fileBuffer);
  return new Response();
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // check auth (403)
  if (!verifyToken(request)) {
    return new Response(null, { status: 403 });
  }

  // verify game and fileName uri prop (400)
  const statePath = sanitizePath("data/states/", `${params.game}/${params.fileName}.state`);
  if (!(await exists(statePath))) {
    return new Response(null, { status: 400 });
  }

  await fs.rm(statePath);
  return new Response();
}
