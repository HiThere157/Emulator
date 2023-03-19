import { useState } from "react";

import { getRomFileName } from "@/helpers/format";

import FileItem from "./FileItem";
import Button from "../Button";

type FilesProps = {
  fileList: File[];
  onBack: () => any;
  onFileSubmit: () => any;
};
export default function Files({ fileList, onBack, onFileSubmit }: FilesProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadedFile[]>(
    fileList.map((file): UploadedFile => {
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
    setIsLoading(true);

    const progress = files.map((file) => {
      const fileName = getRomFileName(file.friendlyName);
      return fetch(`/api/rom/${file.core}/${fileName}`, {
        method: "POST",
        body: file.file,
      });
    });
    await Promise.all(progress);

    setIsLoading(false);
    onFileSubmit();
  };

  return (
    <div className="max-h-[65vh]">
      <div className="py-5 rounded-md overflow-auto bg-darkBg">
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
        <Button theme="color" className="px-2" disabled={isLoading} onClick={uploadFiles}>
          Submit
        </Button>
      </div>
    </div>
  );
}
