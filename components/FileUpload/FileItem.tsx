import { cores } from "@/config/cores";
import { makeFileName, makeFriendlyName } from "@/helpers/upload";

import Dropdown from "../Dropdown";
import Input from "../Input";

import { BsFileEarmarkZip } from "react-icons/bs";

type FileItemProps = {
  file: UploadedFile;
  onFileChange: (file: UploadedFile) => any;
};
export default function FileItem({ file, onFileChange }: FileItemProps) {
  const formatFileSize = (bytes: number) => {
    const units = ["bytes", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let i = 0;

    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }

    return `${size.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${units[i]}`;
  };

  return (
    <div className="flex items-center gap-8 mx-10">
      <div className="flex flex-col items-center gap-1 text-center w-36">
        <BsFileEarmarkZip className="text-7xl text-el2Accent" />
        <span className="text-sm text-whiteColorAccent break-all whitespace-normal">
          {file.file.name}
        </span>
      </div>

      <div className="grid grid-cols-[auto_1fr] flex-grow gap-2 mr-7">
        <span className="text-whiteColorAccent">Name:</span>
        <Input
          value={file.friendlyName}
          className="mr-5"
          onChange={(friendlyName: string) => {
            onFileChange({
              ...file,
              friendlyName: makeFriendlyName(makeFileName(friendlyName, "rom")),
            });
          }}
        />

        <span className="text-whiteColorAccent">Core:</span>
        <Dropdown
          items={Object.keys(cores)}
          friendlyLookup={cores}
          value={file.core}
          onChange={(core: string) => onFileChange({ ...file, core })}
        />

        <span className="text-whiteColorAccent">Size:</span>
        <span className="text-whiteColorAccent">{formatFileSize(file.file.size)}</span>
      </div>
    </div>
  );
}
