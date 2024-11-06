import React from "react";
import { Card } from "react-bootstrap";

const CurrentWeather = ({ weatherData, location }) => {
  const currentHourIndex = new Date().getHours();
  const currentTemperature =
    weatherData.hourly.temperature_2m[new Date().getHours()];
  const currentWeatherCode = weatherData.hourly.weather_code[currentHourIndex];
  const currentDate = `Date: ${new Date().getDate()}, Time: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
  console.log("date: ", currentDate);
  const currentTimezone = weatherData.timezone;
  return (
    <div className="text-white p-3 pt-0">
      <div className="flex flex-col text-lg justify-center items-center">
        <div className="font-bold p-2 text-xl text-green-500">
          <span>Current Weather</span>
        </div>
        <div className="flex gap-20 text-sm items-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <span className="text-yellow-400">{currentTimezone}</span>
            <span>{currentDate}</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <span className="text-yellow-400">Temperature</span>
            <span>{currentTemperature}°C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-400">Weather </span>

            <span className="text-3xl">
              {getWeatherIcon(currentWeatherCode)} {}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  //Helper function to return an emoji based on weather code (optional)
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
export default CurrentWeather;
