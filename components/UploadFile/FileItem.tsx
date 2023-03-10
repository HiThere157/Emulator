import { cores } from "@/config/cores";

import Dropdown from "../Dropdown";
import Input from "../Input";

import { BsFileEarmarkZip } from "react-icons/bs";

type FileItemProps = {
  file: UploadedFile;
  onFileChange: (file: UploadedFile) => any;
};
export default function FileItem({ file, onFileChange }: FileItemProps) {
  return (
    <div className="flex items-center gap-8 mx-10">
      <div className="flex flex-col items-center gap-1 text-center w-36">
        <BsFileEarmarkZip className="text-7xl text-el2Accent" />
        <span className=" text-sm text-whiteColorAccent">{file.file.name}</span>
      </div>

      <div className="grid grid-cols-[auto_1fr] flex-grow gap-2 mr-10">
        <span className="text-whiteColorAccent">Friendly Name:</span>
        <Input
          value={file.friendlyName}
          onChange={(friendlyName: string) => onFileChange({ ...file, friendlyName })}
        />

        <span className="text-whiteColorAccent">Core:</span>
        <Dropdown
          items={Object.keys(cores)}
          friendlyLookup={cores}
          value={file.core}
          onChange={(core: string) => onFileChange({ ...file, core })}
        />
      </div>
    </div>
  );
}
