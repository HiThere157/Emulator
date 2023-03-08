import { useState } from "react";

import Popup from "../Popup";
import DragDropFile from "./DragDropFile";
import Files from "./Files";

type UploadFileProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
};
export default function UploadFile({ isOpen, setIsOpen }: UploadFileProps) {
  const [fileList, setFileList] = useState<File[]>([]);

  return (
    <Popup isOpen={isOpen} onBackgroundClick={() => setIsOpen(false)}>
      <div className="w-[45rem] h-[25rem] bg-darkBg rounded-md p-5">
        {fileList.length === 0 ? (
          <DragDropFile onUpload={setFileList} />
        ) : (
          <Files fileList={fileList} onBack={() => setFileList([])} />
        )}
      </div>
    </Popup>
  );
}
