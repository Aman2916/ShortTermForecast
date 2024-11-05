import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const parseCSV = (csvText) => {
  try {
    const lines = csvText.trim().split("\n");
    console.log("Total lines in CSV:", lines.length);

    const headers = lines[0].split(",").map((h) => h.trim());

    // Find indices for our required columns
    const periodEndIndex = headers.indexOf("period_end");
    const dniIndex = headers.indexOf("dni");
    const dhiIndex = headers.indexOf("dhi");
    const ghiIndex = headers.indexOf("ghi");

    console.log("Column indices:", {
      periodEndIndex,
      dniIndex,
      dhiIndex,
      ghiIndex,
    });

    // Verify all required columns exist
    if (
      periodEndIndex === -1 ||
      dniIndex === -1 ||
      dhiIndex === -1 ||
      ghiIndex === -1
    ) {
      console.error("Missing required columns in CSV");
      return [];
    }

    const parsedData = lines.slice(1).map((line) => {
      const values = line.split(",");
      return {
        period_end: values[periodEndIndex].trim(),
        dni: parseFloat(values[dniIndex]) || 0,
        dhi: parseFloat(values[dhiIndex]) || 0,
        ghi: parseFloat(values[ghiIndex]) || 0,
      };
    });

    console.log("Total parsed records:", parsedData.length);
    return parsedData;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return [];
  }
};

const calculateMovingAverage = (data, field, window = 7) => {
  return data.map((item, index, array) => {
    const start = Math.max(0, index - window + 1);
    const values = array.slice(start, index + 1).map((d) => d[field]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg;
  });
};

const SolarIrradianceChart = ({ csvData }) => {
  const processedData = useMemo(() => {
    if (!csvData) {
      console.log("No CSV data provided");
      return [];
    }

    try {
      // Parse CSV data
      const parsedData = parseCSV(csvData);

      if (parsedData.length === 0) {
        console.error("No data parsed from CSV");
        return [];
      }

      // Process the data
      const processed = parsedData.map((d) => {
        const date = new Date(d.period_end);
        if (isNaN(date.getTime())) {
          console.error("Invalid date:", d.period_end);
        }
        return {
          date,
          dni: d.dni,
          dhi: d.dhi,
          ghi: d.ghi,
        };
      });

      console.log("Processed records:", processed.length);

      // Calculate 7-day moving averages
      const dniMA = calculateMovingAverage(processed, "dni");
      const dhiMA = calculateMovingAverage(processed, "dhi");
      const ghiMA = calculateMovingAverage(processed, "ghi");

      const finalData = processed.map((d, i) => ({
        ...d,
        dniMA: dniMA[i],
        dhiMA: dhiMA[i],
        ghiMA: ghiMA[i],
      }));

      console.log("Final data length:", finalData.length);
      return finalData;
    } catch (error) {
      console.error("Error processing data:", error);
      return [];
    }
  }, [csvData]);

  const latestValues = useMemo(() => {
    const latest = processedData[processedData.length - 1];
    return {
      dni: latest?.dni.toFixed(0) || 0,
      dhi: latest?.dhi.toFixed(0) || 0,
      ghi: latest?.ghi.toFixed(0) || 0,
    };
  }, [processedData]);

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return "";
    }
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Early return if no data
  if (!processedData || processedData.length === 0) {
    return (
      <div className="w-full bg-black text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">No data available</h2>
        <p>Please check the console for debugging information.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Solar Irradiance Trends</h2>
        <p className="text-sm mb-2">
          Total data points: {processedData.length}
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold">{latestValues.dni}</div>
            <div className="text-sm text-gray-400">DNI (W/m²)</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold">{latestValues.dhi}</div>
            <div className="text-sm text-gray-400">DHI (W/m²)</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold">{latestValues.ghi}</div>
            <div className="text-sm text-gray-400">GHI (W/m²)</div>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#666"
              interval="preserveEnd"
              minTickGap={50}
            />
            <YAxis
              label={{
                value: "Irradiance (W/m²)",
                angle: -90,
                position: "insideLeft",
              }}
              stroke="#666"
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              labelFormatter={(date) => formatDate(date)}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey="dni"
              stroke="#8884d8"
              dot={false}
              name="DNI"
            />
            <Line
              type="monotone"
              dataKey="dhi"
              stroke="#82ca9d"
              dot={false}
              name="DHI"
            />
            <Line
              type="monotone"
              dataKey="ghi"
              stroke="#ffc658"
              dot={false}
              name="GHI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SolarIrradianceChart;
