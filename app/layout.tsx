import "./global.css";

import Image from "next/image";

import Link from "@/components/Link";
import Profile from "@/components/Header/Profile";

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
      <body className="flex h-screen min-w-[23rem] flex-col bg-darkBg text-whiteColor">
        <header className="sticky top-0 z-[100] flex items-center border-b-2 border-el1 bg-lightBg px-2 py-1">
          <Image
            src={iconPng}
            priority={true}
            alt=""
            className="ml-1 mr-3 mt-[-25px] h-[50px] w-[50px]"
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

          <Profile />
        </header>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
