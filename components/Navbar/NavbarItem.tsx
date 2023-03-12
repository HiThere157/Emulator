import { DragEvent, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cores } from "@/config/cores";

import Button from "../Button";

import { BsPlus, BsDash, BsFillTrashFill, BsGrid3X2GapFill } from "react-icons/bs";

type NavbarItemProps = {
  core: string;
  files: RomFile[];
  isEditing: boolean;
  onMove: () => any;
};
export default function NavbarItem({ core, files, isEditing, onMove }: NavbarItemProps) {
  const path = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragStart = (event: DragEvent, filename: string) => {
    event.dataTransfer.setData("core", core);
    event.dataTransfer.setData("filename", filename);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = async (event: DragEvent) => {
    const sourceCore = event.dataTransfer.getData("core");
    const fileName = event.dataTransfer.getData("filename");

    setIsDragOver(false);
    if (sourceCore === core) return;

    if (core === "Trash") {
      await fetch(`/api/rom/${sourceCore}/${fileName}`, {
        method: "DELETE",
      });
    } else {
      await fetch(`/api/rom/${sourceCore}/${fileName}`, {
        method: "PATCH",
        body: JSON.stringify({
          targetCore: core,
        }),
      });
    }

    onMove();
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div>
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
        <Button
          theme="flat"
          className={
            "px-2 w-full " +
            (isEditing ? "border-2 border-dashed my-1 " : " ") +
            (isDragOver ? "border-el2Accent" : "border-el1Active")
          }
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-1">
            {core === "Trash" ? (
              <div className="text-redColor mr-1">
                <BsFillTrashFill />
              </div>
            ) : (
              <div className="text-xl">{isCollapsed ? <BsPlus /> : <BsDash />}</div>
            )}
            <span className="text-lg">{cores[core] ?? core}</span>
          </div>
        </Button>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col mx-2.5 mb-2">
          {files
            .sort((a: RomFile, b: RomFile) => a.friendlyName.localeCompare(b.friendlyName))
            .map((file, index) => {
              const itemPath = `/player/${file.core}/${file.fileName}`;
              return (
                <Link
                  key={index}
                  draggable={isEditing}
                  onDragStart={(event: DragEvent) => handleDragStart(event, file.fileName)}
                  href={itemPath}
                  className={
                    "flex items-center justify-between group " +
                    (itemPath === path
                      ? "text-whiteColor"
                      : "text-whiteColorAccent hover:text-whiteColor")
                  }
                >
                  {file.friendlyName}
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
