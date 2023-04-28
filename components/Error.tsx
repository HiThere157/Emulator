import { BsExclamationOctagon } from "react-icons/bs";

type ErrorProps = {
  message?: string;
  className?: string;
};
export default function Error({ message, className }: ErrorProps) {
  return (
    <>
      {message && (
        <div className={"flex items-center gap-2 text-redColor " + className}>
          <BsExclamationOctagon className="text-2xl flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </>
  );
}
