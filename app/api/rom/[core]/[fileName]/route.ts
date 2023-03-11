import { promises as fs } from "fs";

import { cores } from "@/config/cores";
import { createDirectory, exists, getRomPath } from "@/helpers/api";

export const revalidate = 0;

type Props = {
  params: {
    core: string;
    fileName: string;
  };
};
export async function GET(_request: Request, { params }: Props) {
  const fileBlob = await fs.readFile(getRomPath(params.core, params.fileName));
  return new Response(fileBlob);
}

export async function POST(request: Request, { params }: Props) {
  const romPath = getRomPath(params.core, params.fileName);
  const fileBuffer = new Uint8Array(await request.arrayBuffer());

  // check core
  if (!Object.keys(cores).includes(params.core)) {
    return new Response(null, { status: 400 });
  }

  // path traversal should not be possible, since the core is whitelisted
  await createDirectory(`data/roms/${params.core}`);

  if (await exists(romPath)) {
    return new Response(null, { status: 400 });
  }

  await fs.writeFile(romPath, fileBuffer);
  return new Response();
}
