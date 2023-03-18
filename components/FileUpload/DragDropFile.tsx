import { ChangeEvent, DragEvent, useState } from "react";

import { BsPlusSquare } from "react-icons/bs";

type DragDropFileProps = {
  onUpload: (fileList: File[]) => any;
};
export default function DragDropFile({ onUpload }: DragDropFileProps) {
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
    onUpload(Array.from(event.dataTransfer.files));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files));
    }
  };

  return (
    <label
      className={
        "flex flex-col gap-6 items-center justify-center h-[25rem] rounded-md border-4 border-dashed cursor-pointer " +
        (isDragging ? "border-el2Accent" : "border-el1")
      }
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <input className="hidden" type="file" multiple={true} onChange={handleChange} />

      <span className="text-2xl text-whiteColorAccent">Drag your files here</span>
      <BsPlusSquare className="text-9xl text-el1" />
    </label>
  );
}
