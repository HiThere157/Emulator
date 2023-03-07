import path from "path";
import { promises as fs } from "fs";

export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};
export async function GET(request: Request, { params }: Props) {
  const romPath = path.join(process.cwd(), `data/roms/${params.id}.rom`);
  return new Response(await fs.readFile(romPath));
}
