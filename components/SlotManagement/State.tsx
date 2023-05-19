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
        "relative flex aspect-square w-44 flex-col items-center justify-center rounded border-4 " +
        (state ? "border-blueColor" : "border-dashed border-el1")
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
        <BsFillFileEarmarkCheckFill className={"mb-2 text-6xl text-blueColor"} />
      )}
      {!state && type === "local" && (
        <BsFillFileEarmarkExcelFill className={"mb-2 text-6xl text-el1"} />
      )}

      {state && type === "remote" && (
        <BsCloudCheckFill className={"mb-2 text-6xl text-blueColor"} />
      )}
      {!state && type === "remote" && <BsCloudSlash className={"mb-2 text-6xl text-el1"} />}

      {state && (
        <>
          <span className="text-lg font-bold">Slot {state?.slot}</span>
          <span className="text-greyColor">{formatBytes(state?.size ?? 0)}</span>
        </>
      )}

      {state && (
        <Title text="Delete State" position="right" className="!absolute right-0 top-0 m-1">
          <Button className="ctrl-invisible py-2" onClick={() => setIsConfirmOpen(true)}>
            <BsFillTrashFill className="text-lg text-redColor" />
          </Button>
        </Title>
      )}
    </div>
  );
}
