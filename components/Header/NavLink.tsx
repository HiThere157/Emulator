"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  matchSubPaths?: boolean;
  children: React.ReactNode;
};
export default function NavLink({ href, matchSubPaths, children }: NavLinkProps) {
  const pathname = usePathname();

  const isMatch = matchSubPaths ? pathname.startsWith(href) : pathname == href;

  return (
    <Link
      className={
        "ctrl-invisible flex items-center h-full rounded px-2 text-lg font-bold " +
        (isMatch ? "text-whiteColor" : "text-greyColor")
      }
      href={href}
    >
      <span>{children}</span>
    </Link>
  );
}
