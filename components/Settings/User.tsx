import { useEffect, useState } from "react";
import { roleClasses } from "@/config/static";
import { getLoginCookie } from "@/helpers/cookie";
import makeApiCall from "@/helpers/api";

import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

import { BsFillTrashFill, BsPersonCircle, BsSave } from "react-icons/bs";

type UserProps = {
  user: User;
  disabled?: boolean;
  onSubmit: () => any;
};
export default function User({ user, disabled, onSubmit }: UserProps) {
  const [result, setResult] = useState<ApiResult<User | undefined>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [role, setRole] = useState<string>(user.role);
  const [enabled, setEnabled] = useState<boolean>(user.enabled);

  useEffect(() => {
    setCurrentUser(getLoginCookie());
  }, []);

  const updateUser = async () => {
    setResult(null);

    // Update the user in the database
    const dbResult = await makeApiCall<User>(
      `/api/users/${user.id}`,
      {
        method: "POST",
        body: JSON.stringify({ username: user.username, role, enabled } as UserCR),
      },
      750,
    );
    setResult(dbResult);

    // Refresh the user list
    if (!dbResult?.error) {
      onSubmit();
    }
  };

  const deleteUser = async () => {
    setResult(null);

    // Delete the user from the database
    const dbResult = await makeApiCall<undefined>(
      `/api/users/${user.id}`,
      {
        method: "DELETE",
      },
      750,
    );
    setResult(dbResult);

    // Refresh the user list
    if (!dbResult?.error) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded py-2 px-3 bg-lightBg">
      <div className="flex items-center gap-3">
        <BsPersonCircle className={"text-3xl " + roleClasses[user.role ?? "Guest"]} />
        <span>{user.username}</span>
        <span className="text-greyColor">(#{user.id})</span>
      </div>

      <div className="flex flex-col flex-grow justify-center items-center gap-2">
        <Loader isVisible={result === null} />
        <Error className="text-xl" message={result?.error} />
      </div>

      <div className="w-48">
        <Dropdown
          values={["Administrator", "Player"]}
          value={role}
          label="Role"
          onChange={setRole}
          disabled={disabled || result === null}
        />
      </div>

      <div className="mr-2">
        <Checkbox
          checked={enabled}
          label="Enabled"
          onChange={setEnabled}
          disabled={disabled || currentUser?.id === user.id || result === null}
        />
      </div>

      <div className="flex gap-2">
        <Button
          className="ctrl-blue py-1.5"
          onClick={updateUser}
          disabled={disabled || result === null}
        >
          <BsSave className="text-lg" />
        </Button>
        <Button
          className="ctrl-red py-1.5"
          onClick={deleteUser}
          disabled={disabled || user.role === "Administrator" || result === null}
        >
          <BsFillTrashFill className="text-xl" />
        </Button>
      </div>
    </div>
  );
}
