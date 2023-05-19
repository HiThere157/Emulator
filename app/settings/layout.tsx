import Link from "@/components/Link";

import { BsDatabaseFillGear, BsPersonFillGear, BsShieldLockFill } from "react-icons/bs";

export default function OptionsLayout({ children }: { children: React.ReactNode }) {
  const className = "gap-2 py-1 px-2 ctrl-invisible";
  const activeClassName = "ctrl-blue";

  return (
    <div className="mx-auto flex h-full max-w-[70rem] flex-col p-4 sm:flex-row">
      <nav className="m-2 flex flex-col gap-2 sm:my-5">
        <Link href="/settings" className={className} activeClassName={activeClassName}>
          <BsDatabaseFillGear className="w-5 text-xl" />
          <span>Storage</span>
        </Link>
        <Link href="/settings/users" className={className} activeClassName={activeClassName}>
          <BsPersonFillGear className="w-5 text-xl" />
          <span>User Management</span>
        </Link>
        <Link href="/settings/auth" className={className} activeClassName={activeClassName}>
          <BsShieldLockFill className="w-5 text-xl" />
          <span>Authentication</span>
        </Link>
      </nav>

      <div className="m-2 rounded border-b-2 border-r-2 border-el1" />

      <div className="flex-grow">{children}</div>
    </div>
  );
}
