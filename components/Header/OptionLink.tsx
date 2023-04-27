"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type OptionLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};
export default function OptionLink({ href, icon, children }: OptionLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={
        "flex items-center whitespace-nowrap rounded gap-2 py-0.5 px-2 " +
        (pathname === href ? "ctrl-blue" : "ctrl-flat")
      }
      href={href}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
