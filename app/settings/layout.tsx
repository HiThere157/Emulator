import Link from "@/components/Link";

import { BsDatabaseFillGear, BsPersonFillGear, BsShieldLockFill } from "react-icons/bs";

export default function OptionsLayout({ children }: { children: React.ReactNode }) {
  const className = "gap-2 py-1 px-2 ctrl-invisible";
  const activeClassName = "ctrl-blue";

  return (
    <div className="flex-col sm:flex-row flex max-w-[70rem] h-full mx-auto p-4">
      <nav className="sm:my-5 flex flex-col gap-2 m-2">
        <Link href="/settings" className={className} activeClassName={activeClassName}>
          <BsDatabaseFillGear className="text-xl w-5" />
          <span>Storage</span>
        </Link>
        <Link href="/settings/users" className={className} activeClassName={activeClassName}>
          <BsPersonFillGear className="text-xl w-5" />
          <span>User Management</span>
        </Link>
        <Link href="/settings/auth" className={className} activeClassName={activeClassName}>
          <BsShieldLockFill className="text-xl w-5" />
          <span>Authentication</span>
        </Link>
      </nav>

      <div className="m-2 rounded border-r-2 border-b-2 border-el1" />

      <div className="flex-grow">{children}</div>
    </div>
  );
}
