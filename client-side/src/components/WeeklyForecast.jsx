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
    <div className="weekly-forecast">
      <h4>Weekly Forecast</h4>
      {daily.time.map((day, index) => (
        <div className="weekly-forecast-item" key={day}>
          <div className="weekly-forecast-day">
            {new Date(day).toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <div className="weekly-forecast-wind">
            {Math.floor(dailyIrradiation[day] / 24)} W/m2
          </div>
          <div className="weekly-forecast-icon">
            {getWeatherIcon(daily.weather_code[index])}
          </div>
          <div className="weekly-forecast-temp">
            {daily.temperature_2m_max[index]}° /{" "}
            {daily.temperature_2m_min[index]}°
          </div>
          <div className="weekly-forecast-wind">
            💨 {daily.precipitation_sum[index]} mm
          </div>
        </div>
      ))}
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
