import { ChangeEvent, DragEvent } from "react";

import { BsPlusSquare } from "react-icons/bs";

type DragDropFileProps = {
  onUpload: (fileList: File[]) => any;
};
export default function DragDropFile({ onUpload }: DragDropFileProps) {
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    onUpload(Array.from(event.dataTransfer.files));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files));
    }
  };

  return (
    <label
      className="flex items-center justify-center h-full rounded-md border-el1 border-4 border-dashed cursor-pointer"
      onDragOver={(e: DragEvent) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input className="hidden" type="file" multiple={true} onChange={handleChange} />

      <div className="flex flex-col items-center gap-6">
        <span className="text-2xl text-whiteColorAccent">Drag your files here</span>
        <BsPlusSquare className="text-9xl text-el1" />
      </div>
    </label>
  );
}
