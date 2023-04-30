"use client";

import { useEffect, useState } from "react";
import { getLoginCookie } from "@/helpers/cookie";
import makeApiCall from "@/helpers/api";

import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import User from "@/components/Settings/User";

import { BsSortDown, BsSortAlphaDown, BsSortAlphaDownAlt, BsStars } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";

const sortTypes: { [key: string]: string } = {
  role: "Role",
  "name-asc": "Name (A → Z)",
  "name-desc": "Name (Z → A)",
  recent: "New Accounts",
};

const sortFunctions: { [key: string]: (a: ReducedUser, b: ReducedUser) => number } = {
  role: (a: ReducedUser, b: ReducedUser) => a.role.localeCompare(b.role),
  "name-asc": (a: ReducedUser, b: ReducedUser) => a.username.localeCompare(b.username),
  "name-desc": (a: ReducedUser, b: ReducedUser) => b.username.localeCompare(a.username),
  recent: (a: ReducedUser, b: ReducedUser) => b.id - a.id,
};

export default function UsersOptionPage() {
  const [users, setUsers] = useState<ApiResult<ReducedUser[]>>(null);
  const [sortType, setSortType] = useState<string>("role");

  const [search, setSearch] = useState<string>("");
  const searchFilter = (user: ReducedUser) =>
    user.username.toLowerCase().includes(search.toLowerCase());

  const isAdmin = getLoginCookie()?.role === "Administrator";

  const fetchData = async () => {
    setUsers(null);
    setUsers(await makeApiCall<ReducedUser[]>("/api/users", undefined, 750));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-center flex-wrap gap-2 m-2">
        <Button className="ctrl-flat px-1 h-7" onClick={fetchData}>
          <FiRefreshCw className="text-lg" />
        </Button>
        <Input value={search} onChange={setSearch} placeholder="Search" />

        <div className="hidden sm:block flex-grow" />

        <Dropdown
          values={Object.keys(sortTypes)}
          value={sortType}
          icons={[
            <BsSortDown key={0} />,
            <BsSortAlphaDown key={1} />,
            <BsSortAlphaDownAlt key={2} />,
            <BsStars key={3} />,
          ]}
          lookup={sortTypes}
          label="Sort By"
          onChange={setSortType}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <Loader isVisible={users === null} />
        <Error className="text-2xl" message={users?.error} />
      </div>

      <div className="flex flex-col-reverse gap-2 p-2">
        {users?.result &&
          users.result
            .filter(searchFilter)
            .sort(sortFunctions[sortType])
            .reverse()
            .map((user) => {
              return <User key={user.id} user={user} disabled={!isAdmin} onSubmit={fetchData} />;
            })}
      </div>
    </div>
  );
}
