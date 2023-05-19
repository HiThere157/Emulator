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
    <Popup isOpen={href !== null} onBackgroundClick={onClose} className="justify-center py-[10vh]">
      <div className="rounded border-2 border-el1 bg-lightBg p-4">
        <h1 className="text-xl font-bold">You are leaving the player</h1>
        <p>Are you sure you want to continue? Unsafed progess will be lost.</p>

        <div data-redirect className="mt-3 flex items-center">
          <Button className="ctrl-flat font-bold" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex-grow" />

          <Link href={href ?? "/"} className="ctrl-red mr-2 px-2 py-0.5 font-bold">
            Go anyway
          </Link>
          <a
            href={href ?? "/"}
            className="ctrl-blue flex items-center gap-1.5 rounded px-2 py-0.5"
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
