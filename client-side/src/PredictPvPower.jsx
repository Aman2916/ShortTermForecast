import React, { useContext, useState } from "react";
import { WeatherContext } from "./WeatherContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

function PredictPVPower() {
  const { weatherData } = useContext(WeatherContext);
  const [predictedPV, setPredictedPV] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    if (weatherData) {
      const { temperature_2m, dhi, ghi, dni, time } =
        extractRelevantData(weatherData);
      const transformedTimes = convertTimesToSinCos(time);

      const requestData = transformedTimes.map((transformedTime, index) => ({
        Hour_Sin: transformedTime.hourSin,
        Hour_Cos: transformedTime.hourCos,
        Month_Sin: transformedTime.monthSin,
        Month_Cos: transformedTime.monthCos,
        Temperature: temperature_2m[index],
        DHI: dhi[index],
        DNI: dni[index],
        GHI: ghi[index],
      }));

      try {
        const response = await fetch("http://localhost:5000/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();

        // Add extra points for padding
        const paddedData = [
          {
            time: "padding-start",
            power: data[0] / 1000,
            temperature: temperature_2m[0],
          },
          ...data.slice(0, 24).map((value, index) => ({
            time: `${index === 0 ? "Now" : `${index} AM`}`,
            power: value / 1000,
            temperature: temperature_2m[index],
          })),
          {
            time: "padding-end",
            power: data[23] / 1000,
            temperature: temperature_2m[23],
          },
        ];
        setPredictedPV(paddedData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const extractRelevantData = (data) => {
    return {
      temperature_2m: data.hourly.temperature_2m,
      dhi: data.hourly.diffuse_radiation,
      dni: data.hourly.direct_normal_irradiance,
      ghi: data.hourly.shortwave_radiation,
      time: data.hourly.time,
    };
  };

  function convertTimesToSinCos(times) {
    return times.map((time) => {
      const formattedTime =
        time.includes("T") && !time.includes("Z") ? `${time}:00Z` : time;
      let date = new Date(formattedTime);

      if (isNaN(date.getTime())) {
        console.error("Invalid timestamp format:", time);
        return null;
      }

      date = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
      const hour = date.getUTCHours();
      const month = date.getUTCMonth() + 1;

      return {
        timestamp: time,
        hourSin: Math.sin((2 * Math.PI * hour) / 24),
        hourCos: Math.cos((2 * Math.PI * hour) / 24),
        monthSin: Math.sin((2 * Math.PI * month) / 12),
        monthCos: Math.cos((2 * Math.PI * month) / 12),
      };
    });
  }

  const formatTime = (time) => {
    if (time === "padding-start" || time === "padding-end") return "";
    if (time === "Now") return time;
    const hour = parseInt(time);
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="w-full max-w-4xl bg-gray-900/80 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            PV Power Prediction
          </h2>
          <button
            onClick={handlePredict}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors
              ${
                loading
                  ? "bg-blue-500 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Predicting...
              </span>
            ) : (
              "Predict Power"
            )}
          </button>
        </div>

        <div className="h-64 w-full bg-gray-800/50 rounded-lg p-4">
          {predictedPV ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={predictedPV}
                margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
              >
                <defs>
                  <linearGradient
                    id="powerGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffcc00" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  tickFormatter={formatTime}
                  tickMargin={10}
                  axisLine={{ strokeWidth: 1.5 }}
                  interval={2}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "auto"]}
                  padding={{ top: 20 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  padding={{ top: 20 }}
                  tickFormatter={(value) => `${value}°`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#94a3b8",
                    padding: "0.5rem",
                  }}
                  formatter={(value, name) => {
                    if (name === "power")
                      return [`${value.toFixed(2)} kW`, "Power"];
                    if (name === "temperature")
                      return [`${value}°`, "Temperature"];
                    return [value, name];
                  }}
                  labelFormatter={formatTime}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="power"
                  stroke="#ff4d4d"
                  fill="url(#powerGradient)"
                  strokeWidth={2}
                  dot={false}
                  name="PV Power"
                  baseValue={0}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#94a3b8"
                  strokeWidth={0}
                  dot={{
                    stroke: "#94a3b8",
                    strokeWidth: 2,
                    r: 4,
                    fill: "#1e293b",
                  }}
                  name="Temperature"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              Click "Predict Power" to see the forecast
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictPVPower;
