import { useState } from "react";

import Popup from "../Popup";
import DragDropFile from "./DragDropFile";
import Files from "./Files";

type UploadFilesProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
  onSubmit: () => any;
};
export default function UploadFiles({ isOpen, setIsOpen, onSubmit }: UploadFilesProps) {
  const [fileList, setFileList] = useState<File[]>([]);

  return (
    <Popup
      isOpen={isOpen}
      onBackgroundClick={() => {
        setIsOpen(false);
        setFileList([]);
      }}
    >
      <div className="w-[45rem] bg-lightBg rounded-md p-5">
        {fileList.length === 0 ? (
          <DragDropFile onUpload={setFileList} />
        ) : (
          <Files
            fileList={fileList}
            onBack={() => setFileList([])}
            onFileSubmit={() => {
              setIsOpen(false);
              setFileList([]);
              onSubmit();
            }}
          />
        )}
      </div>
    </Popup>
  );
}
