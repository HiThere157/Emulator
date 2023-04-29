"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

import { FiRefreshCw } from "react-icons/fi";

export default function UsersOptionPage() {
  const [users, setUsers] = useState<ApiResult<ReducedUser[]>>(null);

  const fetchData = async () => {
    setUsers(null);
    setUsers(await makeApiCall<ReducedUser[]>("/api/users", undefined, 750));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex gap-2 m-2">
        <Button className="ctrl-flat px-1 h-7" onClick={fetchData}>
          <FiRefreshCw className="text-lg" />
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <Loader isVisible={users === null} />
        <Error className="text-2xl" message={users?.error} />
      </div>

      <div></div>
    </div>
  );
}
