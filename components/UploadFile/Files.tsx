import Button from "../Button";

type FilesProps = {
  fileList: File[];
  onBack: () => any;
};
export default function Files({ fileList, onBack }: FilesProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        {fileList.map((file, index) => {
          return <div key={index}>{file.name}</div>;
        })}
      </div>

      <div className="flex justify-center gap-2 text-xl">
        <Button theme="flat" className="px-2" onClick={onBack}>
          Back
        </Button>
        <Button theme="color" className="px-2" onClick={onBack}>
          Submit
        </Button>
      </div>
    </div>
  );
}
