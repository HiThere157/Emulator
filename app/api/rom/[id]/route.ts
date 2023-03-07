import path from "path";
import { promises as fs } from "fs";

export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};
export async function GET(request: Request, { params }: Props) {
  const romDBPath = path.join(process.cwd(), "data/roms.json");
  const romDB: RomFile[] = JSON.parse(await fs.readFile(romDBPath, { encoding: "utf-8" }));
  return new Response(JSON.stringify(romDB.find((file) => file.id === params.id)));
}
