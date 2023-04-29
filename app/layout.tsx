import "./global.css";

import Image from "next/image";

import Link from "@/components/Link";
import User from "@/components/Header/User";

import iconPng from "@/assets/icon.png";

export const metadata = {
  title: "Emulator",
  description: "Online Retro Video Game Emulator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const className = "ctrl-invisible h-full px-2 text-lg font-bold text-greyColor";
  const activeClassName = "text-whiteColor";

  return (
    <html lang="en">
      <body className="flex flex-col h-screen text-whiteColor bg-darkBg">
        <header className="sticky top-0 flex items-center px-2 py-1 bg-lightBg border-b-2 border-el1 z-[100]">
          <Image
            src={iconPng}
            priority={true}
            alt=""
            className="w-[50px] h-[50px] mt-[-25px] ml-1 mr-3"
            width="50"
            height="50"
          />

          <Link href="/" className={className} activeClassName={activeClassName}>
            Library
          </Link>
          <Link href="/states" className={className} activeClassName={activeClassName}>
            States
          </Link>
          <Link
            href="/settings"
            matchSubPaths={true}
            className={className}
            activeClassName={activeClassName}
          >
            Settings
          </Link>

          <div className="flex-grow" />

          <User />
        </header>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
