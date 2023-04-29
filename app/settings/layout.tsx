import Link from "@/components/Link";

import { BsDatabaseFillGear, BsPersonFillGear } from "react-icons/bs";

export default function OptionsLayout({ children }: { children: React.ReactNode }) {
  const className = "gap-2 py-1 px-2 ctrl-invisible";
  const activeClassName = "ctrl-blue";

  return (
    <div className="flex justify-center px-60 h-full">
      <div className="flex flex-grow p-4">
        <nav className="flex flex-col gap-2 my-5">
          <Link href="/settings/storage" className={className} activeClassName={activeClassName}>
            <BsDatabaseFillGear className="text-xl w-5" />
            <span>Storage</span>
          </Link>
          <Link href="/settings/users" className={className} activeClassName={activeClassName}>
            <BsPersonFillGear className="text-xl w-5" />
            <span>User Management</span>
          </Link>
        </nav>

        <div className="mx-4 my-2 rounded border-r-2 border-el1" />

        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
