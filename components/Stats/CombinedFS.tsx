"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HeaderStats() {
  const [stats, setStats] = useState<ApiResult<File[]>>(null);

  const fetchStats = async () => {
    setStats(null);
    setStats(await makeApiCall<File[]>("/api/fs"));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="h-9 mx-2 opacity-70">
      <Doughnut
        options={{
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        }}
        data={{
          labels: ["Roms", "States"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19],
              backgroundColor: [
                "#208CF0",
                "#B92828",
              ],
              borderWidth: 0,
            },
          ],
        }}
      />
    </div>
  );
}
