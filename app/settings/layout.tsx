import SettingsLinkProps from "@/components/Settings/SettingsLink";

import { BsDatabaseFillGear, BsPersonFillGear } from "react-icons/bs";

export default function OptionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center px-60 h-full">
      <div className="flex flex-grow p-4">
        <nav className="flex flex-col gap-2 my-5">
          <SettingsLinkProps
            href="/settings/storage"
            icon={<BsDatabaseFillGear className="text-2xl w-6" />}
          >
            Storage
          </SettingsLinkProps>
          <SettingsLinkProps
            href="/settings/users"
            icon={<BsPersonFillGear className="text-2xl w-6" />}
          >
            User Management
          </SettingsLinkProps>
        </nav>

        <div className="mx-4 my-2 rounded border-r-2 border-el1" />

        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
