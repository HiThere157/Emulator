import path from "path";
import { promises as fs } from "fs";

import { cores } from "@/config/cores";

export const revalidate = 0;

type FileProps = {
  core: string;
  fileName: string;
};

function getRomPath(params: FileProps) {
  const unsafePath = `data/roms/${params.core}/${params.fileName}`;
  const safePath = path.normalize(unsafePath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(process.cwd(), safePath);
}

export async function GET(_request: Request, { params }: { params: FileProps }) {
  const fileBlob = await fs.readFile(getRomPath(params));
  return new Response(fileBlob);
}

export async function POST(request: Request, { params }: { params: FileProps }) {
  const romPath = getRomPath(params);
  const fileBuffer = new Uint8Array(await request.arrayBuffer());

  // check core
  if (!Object.keys(cores).includes(params.core)) {
    return new Response(null, { status: 400 });
  }

  // path traversal should not be possible, since the core is whitelisted
  try {
    await fs.access(`data/roms/${params.core}`, fs.constants.F_OK);
  } catch {
    await fs.mkdir(`data/roms/${params.core}`);
  }

  try {
    await fs.access(romPath, fs.constants.F_OK);
    return new Response(null, { status: 400 });
  } catch {
    await fs.writeFile(romPath, fileBuffer);
    return new Response();
  }
}
