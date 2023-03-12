import { BsExclamationOctagon } from "react-icons/bs";

type ErrorProps = {
  message?: string;
};
export default function Error({ message }: ErrorProps) {
  return (
    <>
      {message && (
        <div className="flex items-center gap-2 text-xl text-redColor">
          <BsExclamationOctagon className="text-2xl" />
          <span>{message}</span>
        </div>
      )}
    </>
  );
}
