import React from "react";
import { Card } from "react-bootstrap";

const CurrentWeather = ({ weatherData, location }) => {
  const currentHourIndex = new Date().getHours();
  const currentTemperature =
    weatherData.hourly.temperature_2m[new Date().getHours()];
  const currentWeatherCode = weatherData.hourly.weather_code[currentHourIndex];
  return (
    <Card className="mb-3">
      <Card.Body>
        <h3>{location}</h3>
        <p>Current Temperature: {currentTemperature}°C</p>
        <p>
          Weather: {getWeatherIcon(currentWeatherCode)} {}
        </p>
      </Card.Body>
    </Card>
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
