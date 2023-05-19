import { ChangeEvent, DragEvent, useState } from "react";

import { BsFillFileEarmarkCheckFill, BsPlusSquare } from "react-icons/bs";

type FileUploadProps = {
  fileName?: string;
  disabled?: boolean;
  onUpload: (fileList: File) => any;
};
export default function FileUpload({ fileName, disabled, onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (!event.dataTransfer?.files) return;
    onUpload(event.dataTransfer.files[0]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(event.target.files[0]);
    }
  };

  return (
    <label
      className={
        "m-1 flex cursor-pointer items-center justify-center gap-2 rounded border-2 border-dashed p-2 " +
        (isDragging ? "border-blueColor" : "border-el1")
      }
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <input
        className="hidden"
        type="file"
        multiple={true}
        onChange={handleChange}
        disabled={disabled}
      />

      {fileName ? (
        <>
          <BsFillFileEarmarkCheckFill className="text-4xl text-blueColor" />
          <span className="text-greyColor">{fileName}</span>
        </>
      ) : (
        <>
          <BsPlusSquare className="text-4xl text-el1" />
          <span className="text-greyColor">Upload Rom File</span>
        </>
      )}
    </label>
  );
}
