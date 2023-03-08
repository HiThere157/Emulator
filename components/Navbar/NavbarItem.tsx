import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Button from "../Button";

import { BsPlus, BsDash } from "react-icons/bs";

type NavbarItemProps = {
  core: string;
  files: RomFile[];
};
export default function NavbarItem({ core, files }: NavbarItemProps) {
  const path = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const friendlyCoreNames: { [key: string]: string } = {
    n64: "Nintendo 64",
  };

  return (
    <div>
      <Button theme="flat" className="px-2 w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <div className="text-xl">{isCollapsed ? <BsPlus /> : <BsDash />}</div>
          <span>{friendlyCoreNames[core] ?? core}</span>
        </div>
      </Button>
      {!isCollapsed && (
        <div className="flex flex-col mx-2.5">
          {files.map((file, index) => {
            const itemPath = `/player/${file.core}/${file.fileName}`;
            return (
              <Link
                key={index}
                href={itemPath}
                className={
                  "text-sm " +
                  (itemPath === path
                    ? "text-whiteColor"
                    : "text-whiteColorAccent hover:text-whiteColor")
                }
              >
                {file.friendlyName}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
