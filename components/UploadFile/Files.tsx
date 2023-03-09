import FileItem from "./FileItem";
import Button from "../Button";

type FilesProps = {
  fileList: File[];
  onBack: () => any;
};
export default function Files({ fileList, onBack }: FilesProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-8 py-5 flex-grow bg-darkBg rounded-md overflow-auto">
        {fileList.map((file, index) => {
          return <FileItem key={index} file={file} />;
        })}
      </div>

      <div className="flex justify-center gap-2 pt-2 text-xl mb-[-0.75rem]">
        <Button theme="color" className="px-2" onClick={onBack}>
          Back
        </Button>
        <Button theme="color" className="px-2" onClick={onBack}>
          Submit
        </Button>
      </div>
    </div>
  );
}
