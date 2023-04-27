import { PulseLoader } from "react-spinners";

type LoaderProps = {
  isVisible: boolean;
  className?: string;
};
export default function Loader({ isVisible, className }: LoaderProps) {
  return (
    <>
      {isVisible && (
        <PulseLoader size="15px" color="#208CF0" className={className} speedMultiplier={0.6} />
      )}
    </>
  );
}
