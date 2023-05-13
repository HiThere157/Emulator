import Popup from "@/components/Popup/Popup";
import Link from "@/components/Link";
import Button from "@/components/Button";

import { BsBoxArrowUpRight } from "react-icons/bs";

type RedirectPopupProps = {
  href: string | null;
  onClose: () => void;
};
export default function RedirectPopup({ href, onClose }: RedirectPopupProps) {
  return (
    <Popup isOpen={href !== null} onBackgroundClick={onClose} className="py-[10vh] justify-center">
      <div className="p-4 rounded border-2 bg-lightBg border-el1">
        <h1 className="text-xl font-bold">You are leaving the player</h1>
        <p>Are you sure you want to continue? Unsafed progess will be lost.</p>

        <div data-redirect className="flex items-center mt-3">
          <Button className="ctrl-flat font-bold" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex-grow" />

          <Link href={href ?? "/"} className="ctrl-red py-0.5 px-2 font-bold mr-2">
            Go anyway
          </Link>
          <a
            href={href ?? "/"}
            className="ctrl-blue flex items-center gap-1.5 py-0.5 px-2 rounded"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <BsBoxArrowUpRight className="text-lg" />
            <span className="font-bold">Open new Tab</span>
          </a>
        </div>
      </div>
    </Popup>
  );
}
