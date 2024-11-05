import React, { useEffect, useState } from "react";

const Forecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchForecast = async () => {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=21.282&longitude=81.602&hourly=temperature_2m&timezone=Asia/Kolkata"
      );
      const data = await response.json();
      const hourly = data.hourly;
      const forecast = hourly.time.map((time, index) => ({
        time,
        temperature: hourly.temperature_2m[index],
      }));
      const next24Hours = get24HourForecast(forecast);
      setForecastData(next24Hours);
    };
    fetchForecast();
  }, []);

  // Filter for the next 24 hours starting from the current hour
  const get24HourForecast = (forecastData) => {
    const now = new Date();
    return forecastData
      .filter((entry) => new Date(entry.time) >= now)
      .slice(0, 24);
  };

  // Scroll Handlers
  const scrollLeft = () => setScrollPosition((prev) => Math.max(prev - 1, 0));
  const scrollRight = () =>
    setScrollPosition((prev) => Math.min(prev + 1, forecastData.length - 6));

  return (
    <div>
      <h2>24-Hour Solar Forecast</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <button onClick={scrollLeft} style={{ color: "red" }}>
          ←
        </button>
        <button onClick={scrollRight}>→</button>
      </div>
      <div style={{ display: "flex", overflow: "hidden", maxWidth: "100%" }}>
        {forecastData
          .slice(scrollPosition, scrollPosition + 6)
          .map((hourData, index) => {
            const time = new Date(hourData.time).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <div
                key={index}
                style={{
                  flex: "0 0 120px",
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: index === 0 ? "#ffd700" : "#f0f0f0",
                  margin: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <strong>{time}</strong>
                <div>{hourData.temperature}°C</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Forecast;
