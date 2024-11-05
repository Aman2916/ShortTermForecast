import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HourlyGraph = ({ hourlyData }) => {
  const data = {
    labels: hourlyData.time.slice(0, 24),
    datasets: [
      {
        label: "Temperature (°C)",
        data: hourlyData.temperature_2m.slice(0, 24),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <div className="hourly-graph">
      <Line data={data} options={{ responsive: true }} />
    </div>
  );
};

export default HourlyGraph;
