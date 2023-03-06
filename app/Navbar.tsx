import path from "path";
import { promises as fs } from "fs";

import NavbarItem from "./NavbarItem";

async function getFolderContents(): Promise<RomFolder[]> {
  const romsPath = path.join(process.cwd(), "data/roms");
  const folderNames = await fs.readdir(romsPath);

  const folders: RomFolder[] = await Promise.all(
    folderNames.map(async (folderName) => {
      const fileNames = await fs.readdir(`${romsPath}/${folderName}`);

      return {
        name: folderName,
        files: fileNames,
      };
    }),
  );

  return folders;
}

export default async function Navbar() {
  const folders = await getFolderContents();

  return (
    <nav className="flex flex-col gap-3 bg-lightBg p-2 h-full w-40">
      {folders.map((folder, index) => {
        return <NavbarItem key={index} folder={folder} />;
      })}
    </nav>
  );
}
