"use client";

import { useEffect, useState } from "react";
import { cores } from "@/config/static";
import { formatBytes } from "@/helpers/format";
import makeApiCall from "@/helpers/api";

import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FiRefreshCw } from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend);

type AggregatedStorage = {
  labels: string[];
  data: number[];
};
type RawDataSet = {
  roms: RomFile[];
  states: StateFile[];
  users: ReducedUser[];
};

const generateDataset = (aggregated: AggregatedStorage): ChartData<"doughnut"> => {
  return {
    labels: aggregated.labels,
    datasets: [
      {
        label: " Bytes",
        data: aggregated.data,
        backgroundColor: ["#173F5F", "#20639B", "#3CAEA3", "#F6D55C", "#ED553B"],
        hoverOffset: 10,
        borderWidth: 0,
      },
    ],
  };
};

const storageCharts: { [key: string]: string } = {
  combined: "Combined",
  "roms-game": "ROMs (Game)",
  "roms-platform": "ROMs (Platform)",
  "states-user": "States (User)",
  "states-game": "States (Game)",
};

const storageAggregators: {
  [key: string]: (raw: RawDataSet) => AggregatedStorage;
} = {
  combined: ({ roms, states }) => {
    return {
      labels: ["ROMs", "States"],
      data: [
        roms.reduce((acc, rom) => acc + rom.size, 0),
        states.reduce((acc, state) => acc + state.size, 0),
      ],
    };
  },
  "roms-game": ({ roms }) => {
    const sortedRoms = roms.sort((a, b) => a.size - b.size);

    return {
      labels: sortedRoms.map((rom) => rom.name),
      data: sortedRoms.map((rom) => rom.size),
    };
  },
  "roms-platform": ({ roms }) => {
    const uniqueCores = roms.reduce((uniqueCores: string[], core: RomFile) => {
      if (!uniqueCores.includes(core.core)) uniqueCores.push(core.core);
      return uniqueCores;
    }, []);

    return {
      labels: uniqueCores.map((core) => cores[core]),
      data: uniqueCores.map((core) => {
        return roms.filter((rom) => rom.core === core).reduce((acc, rom) => acc + rom.size, 0);
      }),
    };
  },
  "states-user": ({ states, users }) => {
    const uniqueUserIds = states.reduce((uniqueUserIds: number[], state: StateFile) => {
      if (!uniqueUserIds.includes(state.user_id)) uniqueUserIds.push(state.user_id);
      return uniqueUserIds;
    }, []);

    return {
      labels: uniqueUserIds.map(
        (userId) => users.find((user) => user.id === userId)?.username ?? "Unknown",
      ),
      data: uniqueUserIds.map((userId) => {
        return states
          .filter((state) => state.user_id === userId)
          .reduce((acc, state) => acc + state.size, 0);
      }),
    };
  },
  "states-game": ({ roms, states }) => {
    const uniqueRomIds = states.reduce((uniqueRomIds: number[], state: StateFile) => {
      if (!uniqueRomIds.includes(state.rom_id)) uniqueRomIds.push(state.rom_id);
      return uniqueRomIds;
    }, []);

    return {
      labels: uniqueRomIds.map((romId) => roms.find((rom) => rom.id === romId)?.name ?? "Unknown"),
      data: uniqueRomIds.map((romId) => {
        return states
          .filter((state) => state.rom_id === romId)
          .reduce((acc, state) => acc + state.size, 0);
      }),
    };
  },
};

export default function StorageOptionsPage() {
  const [roms, setRoms] = useState<ApiResult<RomFile[]>>(null);
  const [states, setStates] = useState<ApiResult<StateFile[]>>(null);
  const [users, setUsers] = useState<ApiResult<ReducedUser[]>>(null);

  const [storageChart, setStorageChart] = useState<string>("combined");

  const fetchData = async () => {
    setRoms(null);
    setStates(null);
    setUsers(null);

    const romsReq = makeApiCall<RomFile[]>("/api/roms");
    const stateReq = makeApiCall<StateFile[]>("/api/states");
    const usersReq = makeApiCall<ReducedUser[]>("/api/users", undefined, 750);

    const [romsResult, stateResult, usersResult] = await Promise.all([romsReq, stateReq, usersReq]);

    setRoms(romsResult);
    setStates(stateResult);
    setUsers(usersResult);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex gap-2 m-2">
        <Dropdown
          values={Object.keys(storageCharts)}
          value={storageChart}
          lookup={storageCharts}
          label="Storage Usage Chart"
          onChange={setStorageChart}
        />
        <Button className="ctrl-flat px-1" onClick={fetchData}>
          <FiRefreshCw className="text-lg" />
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <Loader isVisible={roms === null || states === null || users === null} />
        <Error className="text-2xl" message={roms?.error ?? states?.error ?? users?.error} />
      </div>

      <div className="flex justify-center">
        <div className="relative mt-2 h-[40rem] w-[40rem]">
          <Doughnut
            options={{
              responsive: true,
              layout: {
                padding: {
                  bottom: 10,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.raw as number;
                      return ` Size: ${formatBytes(value)}`;
                    },
                  },
                },
              },
            }}
            data={generateDataset(
              storageAggregators[storageChart]({
                roms: roms?.result ?? [],
                states: states?.result ?? [],
                users: users?.result ?? [],
              }),
            )}
          />
        </div>
      </div>
    </div>
  );
}
