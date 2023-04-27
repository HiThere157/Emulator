import { formatBytes } from "@/helpers/format";

import {
  BsCloudCheckFill,
  BsCloudSlash,
  BsFillFileEarmarkCheckFill,
  BsFillFileEarmarkExcelFill,
} from "react-icons/bs";

type StateProps = {
  state?: StateFile;
  type: "local" | "remote";
};
export default function State({ state, type }: StateProps) {
  return (
    <div
      className={
        "flex flex-col justify-center items-center w-44 aspect-square border-4 rounded " +
        (state ? "border-blueColor" : "border-el1 border-dashed")
      }
    >
      {state && type === "local" && (
        <BsFillFileEarmarkCheckFill className={"text-6xl mb-2 text-blueColor"} />
      )}
      {!state && type === "local" && (
        <BsFillFileEarmarkExcelFill className={"text-6xl mb-2 text-el1"} />
      )}

      {state && type === "remote" && (
        <BsCloudCheckFill className={"text-6xl mb-2 text-blueColor"} />
      )}
      {!state && type === "remote" && <BsCloudSlash className={"text-6xl mb-2 text-el1"} />}

      {state && (
        <>
          <span className="text-lg font-bold">Slot {state?.slot}</span>
          <span className="text-greyColor">{formatBytes(state?.size ?? 0)}</span>
        </>
      )}
    </div>
  );
}
