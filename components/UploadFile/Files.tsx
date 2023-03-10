import { useState } from "react";

import FileItem from "./FileItem";
import Button from "../Button";

type FilesProps = {
  fileList: File[];
  onBack: () => any;
};
export default function Files({ fileList, onBack }: FilesProps) {
  const [files, setFiles] = useState<UploadedFile[]>(
    fileList.map((file) => {
      return {
        friendlyName: file.name.split(".")[0],
        core: "none",
        file: file,
      };
    }),
  );

  const onFileChange = (file: UploadedFile, index: number) => {
    const _files = [...files];
    _files[index] = file;
    setFiles(_files);
  };

  const onSubmit = () => {
    files.forEach(async (file) => {
      const fileName = `${file.friendlyName
        .replace(/[^0-9a-zA-Z ]/g, "")
        .replace(" ", "-")}.${file.file.name.split(".").at(-1)}`;

      await fetch(`/api/rom/${file.core}/${fileName}`, {
        method: "POST",
        body: file.file,
      });

      await fetch("/api/roms", {
        method: "POST",
        body: JSON.stringify({
          friendlyName: file.friendlyName,
          core: file.core,
          fileName,
        }),
      });
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-8 py-5 flex-grow bg-darkBg rounded-md overflow-auto">
        {files.map((file, index) => {
          return (
            <FileItem
              key={index}
              file={file}
              onFileChange={(file: UploadedFile) => onFileChange(file, index)}
            />
          );
        })}
      </div>

      <div className="flex justify-center gap-2 pt-2 text-xl mb-[-0.75rem]">
        <Button theme="color" className="px-2" onClick={onBack}>
          Back
        </Button>
        <Button theme="color" className="px-2" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
