import { DragEvent, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cores } from "@/config/cores";
import { makeFriendlyName } from "@/helpers/upload";

import Button from "../Button";

import { BsPlus, BsDash, BsGrid3X2GapFill } from "react-icons/bs";

type NavbarItemProps = {
  core: string;
  files: RomFile[];
  isEditing: boolean;
};
export default function NavbarItem({ core, files, isEditing }: NavbarItemProps) {
  const path = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleDragStart = (event: DragEvent, filename: string) => {
    event.dataTransfer.setData("core", core);
    event.dataTransfer.setData("filename", filename);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: DragEvent) => {};

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <Button theme="flat" className="px-2 w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <div className="text-xl">{isCollapsed ? <BsPlus /> : <BsDash />}</div>
          <span>{cores[core] ?? core}</span>
        </div>
      </Button>
      {!isCollapsed && (
        <div className="flex flex-col mx-2.5">
          {files.map((file, index) => {
            const itemPath = `/player/${file.core}/${file.fileName}`;
            return (
              <Link
                draggable={isEditing}
                onDragStart={(event: DragEvent) => handleDragStart(event, file.fileName)}
                key={index}
                href={itemPath}
                className={
                  "flex items-center justify-between group text-sm " +
                  (itemPath === path
                    ? "text-whiteColor"
                    : "text-whiteColorAccent hover:text-whiteColor")
                }
              >
                {makeFriendlyName(file.fileName)}
                {isEditing && (
                  <BsGrid3X2GapFill className="rotate-90 invisible group-hover:visible" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
