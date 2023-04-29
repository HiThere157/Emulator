"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  className?: string;
  activeClassName?: string;
  matchSubPaths?: boolean;
  children: React.ReactNode;
};
export default function CustomLink({
  href,
  className,
  activeClassName,
  matchSubPaths,
  children,
}: NavLinkProps) {
  const pathname = usePathname();

  const isMatch = matchSubPaths ? pathname.startsWith(href) : pathname == href;

  return (
    <Link
      className={
        "flex items-center rounded whitespace-nowrap " +
        (isMatch ? activeClassName : "") +
        " " +
        className
      }
      href={href}
    >
      {children}
    </Link>
  );
}
