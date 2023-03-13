import "./global.css";

import Navbar from "../components/Navbar/Navbar";

export const metadata = {
  title: "Emulator",
  description: "Online Retro Video Game Emulator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark flex flex-col w-screen h-screen text-whiteColor bg-darkBg sm:flex-row">
        <Navbar />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
