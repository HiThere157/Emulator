import path from "path";
import { promises as fs } from "fs";

export const revalidate = 0;

type Props = {
  params: {
    core: string;
    fileName: string;
  };
};
export async function GET(request: Request, { params }: Props) {
  const romPath = path.join(process.cwd(), `data/roms/${params.core}/${params.fileName}`);
  return new Response(await fs.readFile(romPath));
}
