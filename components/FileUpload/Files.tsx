import { useState } from "react";

import { makeFileName } from "@/helpers/upload";

import FileItem from "./FileItem";
import Button from "../Button";

type FilesProps = {
  fileList: File[];
  onBack: () => any;
  onFileSubmit: () => any;
};
export default function Files({ fileList, onBack, onFileSubmit }: FilesProps) {
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

  const uploadFiles = async () => {
    const progress = files.map((file) => {
      const fileName = makeFileName(file.friendlyName, file.file.name.split(".").at(-1) ?? "rom");
      return fetch(`/api/rom/${file.core}/${fileName}`, {
        method: "POST",
        body: file.file,
      });
    });

    await Promise.all(progress);
    onFileSubmit();
  };

  return (
    <div className="flex flex-col max-h-[65vh]">
      <div className="flex flex-col py-5 flex-grow bg-darkBg rounded-md overflow-auto">
        {files.map((file, index) => {
          return (
            <div key={index}>
              {index !== 0 && <hr className="mx-5 my-6 border-el1" />}
              <FileItem
                file={file}
                onFileChange={(file: UploadedFile) => onFileChange(file, index)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 pt-2 text-xl mb-[-0.75rem]">
        <Button theme="color" className="px-2" onClick={onBack}>
          Back
        </Button>
        <Button theme="color" className="px-2" onClick={uploadFiles}>
          Submit
        </Button>
      </div>
    </div>
  );
}
