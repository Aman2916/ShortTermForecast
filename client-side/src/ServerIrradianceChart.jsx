import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";

const ServerIrradianceChart = () => {
  const cityMapping = {
    Indore: 1,
    Delhi: 2,
    Assam: 3,
  };

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [data, setData] = useState({ original: [], movingAvg: [] });
  const [error, setError] = useState(null);

  const cities = ["Indore", "Delhi", "Assam"];
  const years = [2020, 2021, 2022, 2023, 2024];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const validateAndNormalizeData = (rawData) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      throw new Error("Invalid data format received");
    }

    // Define expected value ranges for each target type
    const valueRanges = {
      dni: { min: 0, max: 1200 }, // Direct Normal Irradiance typical range
      ghi: { min: 0, max: 1000 }, // Global Horizontal Irradiance typical range
      dhi: { min: 0, max: 600 }, // Diffuse Horizontal Irradiance typical range
      pv: { min: 0, max: 2000 }, // PV output typical range
    };

    const range = valueRanges[selectedTarget.toLowerCase()] || {
      min: 0,
      max: 2000,
    };

    return rawData
      .map((item) => {
        // Ensure date is valid
        const date = new Date(item.date);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date found: ${item.date}`);
          return null;
        }

        // Convert value to number if it's a string
        let value =
          typeof item.value === "string" ? parseFloat(item.value) : item.value;

        // Check if value is within expected range
        if (value > range.max) {
          console.warn(
            `Value ${value} exceeds maximum expected value ${range.max}. Normalizing...`
          );
          value = value / 1000;
        }

        if (isNaN(value) || value < range.min || value > range.max) {
          console.warn(`Invalid value after normalization: ${value}`);
          return null;
        }

        return {
          date: date,
          value: value,
        };
      })
      .filter((item) => item !== null);
  };

  const fetchData = async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:5000/api/irradiance", {
        params: {
          city: cityMapping[selectedCity],
          year: selectedYear || "",
          month: months.indexOf(selectedMonth) + 1 || "",
          target: selectedTarget || "",
        },
      });

      const validatedData = validateAndNormalizeData(response.data);

      const sortedData = validatedData.sort((a, b) => a.date - b.date);

      const movingAverageData = sortedData.map((d, i, arr) => {
        const start = Math.max(0, i - 6);
        const subset = arr.slice(start, i + 1);
        const avg = d3.mean(subset, (s) => s.value);
        return { date: d.date, value: avg };
      });

      setData({ original: sortedData, movingAvg: movingAverageData });
    } catch (error) {
      console.error("Error processing data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (selectedCity && selectedYear && selectedTarget) {
      fetchData();
    }
  }, [selectedCity, selectedYear, selectedMonth, selectedTarget]);

  return (
    <div className="p-4 m-4 border-1 text-white rounded-lg">
      <h1 className="text-2xl mb-4">Solar Irradiance Data Visualization</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2">City:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 bg-white/10 rounded"
          >
            <option value="" className="bg-[#0b0449]">
              Select City
            </option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-[#0b0449]">
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 bg-white/10 rounded"
          >
            <option value="" className="bg-[#0b0449]">
              Select Year
            </option>
            {years.map((year) => (
              <option key={year} value={year} className="bg-[#0b0449]">
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 bg-white/10 rounded"
          >
            <option value="" className="bg-[#0b0449]">
              Select Month
            </option>
            {months.map((month) => (
              <option key={month} value={month} className="bg-[#0b0449]">
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label className="block mb-2">Target Variable:</label>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full p-2 bg-white/10 rounded"
          >
            <option value="" className="bg-[#0b0449]">
              Select Target
            </option>
            <option value="dni" className="bg-[#0b0449]">
              DNI
            </option>
            <option value="ghi" className="bg-[#0b0449]">
              GHI
            </option>
            <option value="dhi" className="bg-[#0b0449]">
              DHI
            </option>
            <option value="pv" className="bg-[#0b0449]">
              PV
            </option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-lg">
        <Chart data={data} />
      </div>
    </div>
  );
};

const Chart = ({ data, target }) => {
  const svgRef = useRef();

  const getYAxisDomain = (data, target) => {
    const values = data.original.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Add padding to the domain
    const padding = (maxValue - minValue) * 0.1;

    // Set reasonable minimum bounds based on target type
    const minimumBounds = {
      dni: [0, 1200],
      ghi: [0, 1000],
      dhi: [0, 600],
      pv: [0, 2000],
    };

    const bounds = minimumBounds[target?.toLowerCase()] || [0, 1000];

    return [
      Math.max(0, Math.min(bounds[0], minValue - padding)),
      Math.min(bounds[1], maxValue + padding),
    ];
  };

  useEffect(() => {
    if (data.original.length) {
      renderChart(data);
    }
  }, [data]);

  const renderChart = (chartData) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Use the custom domain calculation
    const yDomain = getYAxisDomain(chartData, target);

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(chartData.original, (d) => d.date))
      .range([0, innerWidth]);

    const y = d3.scaleLinear().domain(yDomain).nice().range([innerHeight, 0]);

    // Create the SVG group for the chart
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add bars
    const barWidth = Math.max(1, innerWidth / chartData.original.length - 1);
    g.selectAll("rect")
      .data(chartData.original)
      .join("rect")
      .attr("x", (d) => x(new Date(d.date)))
      .attr("y", (d) => y(d.value))
      .attr("width", barWidth)
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", "#374151")
      .attr("opacity", 0.7);

    // Add moving average line
    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(chartData.movingAvg)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add axes with more frequent ticks
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeDay.every(1)) // Show daily ticks
          .tickSize(-innerHeight)
          .tickPadding(10)
      )
      .attr("color", "#6B7280");

    const yAxis = g
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(10) // Increase number of ticks
          .tickSize(-innerWidth)
          .tickFormat((d) => d.toFixed(1)) // Show one decimal place
          .tickPadding(10)
      )
      .attr("color", "#6B7280");

    // Style gridlines
    svg.selectAll(".tick line").attr("stroke", "#374151").attr("opacity", 0.5);

    // Remove domain lines
    xAxis.select(".domain").remove();
    yAxis.select(".domain").remove();

    // Rotate x-axis labels for better readability
    xAxis
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    // Add hover effects with detailed tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll("rect")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "#4B5563");

        const movingAvgValue = chartData.movingAvg.find(
          (m) => m.date === d.date
        )?.value;
        tooltip.style("opacity", 1).html(`
            Date: ${new Date(d.date).toLocaleDateString()}<br/>
            Daily Value: ${d.value.toFixed(2)}<br/>
            Moving Avg: ${movingAvgValue ? movingAvgValue.toFixed(2) : "N/A"}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr("fill", "#374151");
        tooltip.style("opacity", 0);
      });
  };

  return (
    <svg
      ref={svgRef}
      width={800}
      height={400}
      className="w-full bg-white/5 border-2 border-white/10 rounded-lg"
    ></svg>
  );
};

export default ServerIrradianceChart;
