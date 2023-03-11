import path from "path";
import { promises as fs } from "fs";

import { cores } from "@/config/cores";
import { createDirectory, exists } from "@/helpers/fs";

export const revalidate = 0;

function getRomPath(core: string, fileName: string) {
  const unsafePath = `data/roms/${core}/${fileName}`;
  const safePath = path.normalize(unsafePath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(process.cwd(), safePath);
}

type Props = {
  params: {
    core: string;
    fileName: string;
  };
};
export async function GET(request: Request, { params }: Props) {
  const fileBlob = await fs.readFile(getRomPath(params.core, params.fileName));
  return new Response(fileBlob);
}

export async function POST(request: Request, { params }: Props) {
  if (!Object.keys(cores).includes(params.core)) {
    return new Response(null, { status: 400 });
  }

  const romPath = getRomPath(params.core, params.fileName);
  if (await exists(romPath)) {
    return new Response(null, { status: 400 });
  }

  const fileBuffer = new Uint8Array(await request.arrayBuffer());
  await createDirectory(`data/roms/${params.core}`);
  await fs.writeFile(romPath, fileBuffer);
  return new Response();
}

export async function PATCH(request: Request, { params }: Props) {
  const { targetCore }: { targetCore: string } = await request.json();
  if (!Object.keys(cores).includes(params.core) || !Object.keys(cores).includes(targetCore)) {
    return new Response(null, { status: 400 });
  }

  const romPath = getRomPath(params.core, params.fileName);
  const targetRomPath = getRomPath(targetCore, params.fileName);

  if ((await exists(targetRomPath)) || !(await exists(romPath))) {
    return new Response(null, { status: 400 });
  }

  await createDirectory(`data/roms/${targetCore}`);
  await fs.rename(romPath, targetRomPath);
  return new Response();
}

export async function DELETE(request: Request, { params }: Props) {
  if (!Object.keys(cores).includes(params.core)) {
    return new Response(null, { status: 400 });
  }

  const romPath = getRomPath(params.core, params.fileName);
  if (!(await exists(romPath))) {
    return new Response(null, { status: 400 });
  }

  await fs.unlink(romPath);
  return new Response();
}
