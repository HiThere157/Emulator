import Link from "next/link";
import { usePathname } from "next/navigation";

type ProfileLinkProps = {
  href: string;
  children: React.ReactNode;
};
export default function ProfileLink({ href, children }: ProfileLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={
        "flex items-center whitespace-nowrap rounded gap-2 py-0.5 px-2 " +
        (pathname === href ? "ctrl-blue" : "ctrl-flat")
      }
      href={href}
    >
      {children}
    </Link>
  );
}
