"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SettingsLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};
export default function SettingsLink({ href, icon, children }: SettingsLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={
        "flex items-center whitespace-nowrap rounded gap-2 py-1 px-2 " +
        (pathname === href ? "ctrl-blue" : "ctrl-invisible")
      }
      href={href}
    >
      {icon}
      <span className="text-lg">{children}</span>
    </Link>
  );
}
