import React from "react";

const WeeklyForecast = ({ weatherData }) => {
  const daily = weatherData.daily;
  const hourlyRadiation = weatherData.hourly.shortwave_radiation;
  const timeStamps = weatherData.hourly.time;
  console.log("time stamp :", timeStamps);
  const dailyIrradiation = {};
  timeStamps.forEach((timestamp, index) => {
    const date = new Date(timestamp).toISOString().split("T")[0]; // Get date part
    if (!dailyIrradiation[date]) dailyIrradiation[date] = 0;
    dailyIrradiation[date] += hourlyRadiation[index]; // Add hourly radiation to daily total
  });

  console.log("Daily Irradiation:", dailyIrradiation);

  return (
    <div className="text-white w-full p-4 pt-0">
      <h2 className="font-bold text-xl p-2 pt-0 text-green-500">
        Weekly Forecast
      </h2>
      <div className="flex text-sm flex-col gap-1">
        {daily.time.map((day, index) => (
          <div
            className={`weekly-forecast-item ${
              new Date(day).toLocaleDateString("en-US", { weekday: "long" }) ===
              new Date().toLocaleDateString("en-US", { weekday: "long" })
                ? "border-2 border-yellow-500"
                : ""
            } flex justify-between px-4 rounded-xl inset-0 bg-white/10 p-2`}
            key={day}
          >
            <div>
              <div className="weekly-forecast-day">
                {new Date(day).toLocaleDateString("en-US", { weekday: "long" })}
              </div>
              <div className="weekly-forecast-wind">
                {Math.floor(dailyIrradiation[day] / 24)} W/m2
              </div>
            </div>
            <div>
              <div className="weekly-forecast-icon">
                {getWeatherIcon(daily.weather_code[index])}
              </div>
              <div className="weekly-forecast-temp">
                {daily.temperature_2m_max[index]}° /{" "}
                {daily.temperature_2m_min[index]}°
              </div>
            </div>
            <div className="weekly-forecast-wind">
              💨 {daily.precipitation_sum[index]} mm
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getWeatherIcon = (code) => {
  switch (code) {
    case 0:
      return "🌞"; // Clear sky
    case 1:
      return "🌤"; // Partly cloudy
    case 2:
      return "☁️"; // Cloudy
    case 3:
      return "🌧"; // Rain
    case 45:
      return "🌫"; // Fog
    case 48:
      return "🌫"; // Foggy
    case 51:
      return "🌦"; // Light drizzle
    case 61:
      return "🌧"; // Light rain
    // Add additional cases for other codes as needed
    default:
      return "❓"; // Unknown code
  }
};
export default WeeklyForecast;
