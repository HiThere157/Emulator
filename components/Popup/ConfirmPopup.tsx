import Popup from "@/components/Popup/Popup";
import Button from "@/components/Button";

import { BsFillTrashFill } from "react-icons/bs";

type ConfirmPopupProps = {
  isOpen: boolean;
  text: string;
  btnText?: string;
  onConfirm: () => void;
  onClose: () => void;
};
export default function ConfirmPopup({
  isOpen,
  text,
  btnText,
  onConfirm,
  onClose,
}: ConfirmPopupProps) {
  return (
    <Popup isOpen={isOpen} onBackgroundClick={onClose} className="justify-center py-[10vh]">
      <div className="rounded border-2 border-el1 bg-lightBg p-4">
        <h1 className="text-xl font-bold">Are you sure?</h1>
        <p>{text}</p>

        <div data-redirect className="mt-3 flex items-center gap-2">
          <Button className="ctrl-flat font-bold" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex-grow" />

          <Button className="ctrl-red flex items-center gap-1.5" onClick={onConfirm}>
            <BsFillTrashFill className="text-xl" />
            <span className="font-bold">{btnText ?? "Delete"}</span>
          </Button>
        </div>
      </div>
    </Popup>
  );
}
