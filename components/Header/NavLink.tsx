"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};
export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={
        "ctrl-el0 flex items-center h-full rounded px-2 text-lg font-bold " +
        (pathname == href ? "text-whiteColor" : "text-greyColor")
      }
      href={href}
    >
      <span>{children}</span>
    </Link>
  );
}
