import { useState } from "react";
import { formatBytes } from "@/helpers/format";

import Button from "@/components/Button";
import ConfirmPopup from "@/components/Popup/ConfirmPopup";
import Title from "@/components/Title";

import {
  BsCloudCheckFill,
  BsCloudSlash,
  BsFillFileEarmarkCheckFill,
  BsFillFileEarmarkExcelFill,
  BsFillTrashFill,
} from "react-icons/bs";

type StateProps = {
  state?: StateFile;
  type: "local" | "remote";
  onDelete: () => void;
};
export default function State({ state, type, onDelete }: StateProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  return (
    <div
      className={
        "relative flex flex-col justify-center items-center w-44 aspect-square border-4 rounded " +
        (state ? "border-blueColor" : "border-el1 border-dashed")
      }
    >
      <ConfirmPopup
        isOpen={isConfirmOpen}
        text={`This will permanently delete this ${type} state file.`}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          onDelete();
        }}
      />

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

      {state && (
        <Title text="Delete State" position="right" className="!absolute top-0 right-0 m-1">
          <Button className="ctrl-invisible py-2" onClick={() => setIsConfirmOpen(true)}>
            <BsFillTrashFill className="text-lg text-redColor" />
          </Button>
        </Title>
      )}
    </div>
  );
}
