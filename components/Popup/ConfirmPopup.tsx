import Popup from "@/components/Popup/Popup";
import Button from "@/components/Button";

import { BsFillTrashFill } from "react-icons/bs";

type ConfirmPopupProps = {
  isOpen: boolean;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
};
export default function ConfirmPopup({ isOpen, text, onConfirm, onClose }: ConfirmPopupProps) {
  return (
    <Popup isOpen={isOpen} onBackgroundClick={onClose} className="py-[10vh] justify-center">
      <div className="p-4 rounded border-2 bg-lightBg border-el1">
        <h1 className="text-xl font-bold">Are you sure?</h1>
        <p>{text}</p>

        <div data-redirect className="flex items-center gap-2 mt-3">
          <Button className="ctrl-flat font-bold" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex-grow" />

          <Button className="ctrl-red flex items-center gap-1.5" onClick={onConfirm}>
            <BsFillTrashFill className="text-xl" />
            <span className="font-bold">Delete</span>
          </Button>
        </div>
      </div>
    </Popup>
  );
}
