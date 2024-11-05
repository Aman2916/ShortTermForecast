// import React from "react";
// import { Card, Row, Col } from "react-bootstrap";

// const TodayForecast = ({ weatherData }) => {
//   const hourlyTemps = weatherData.hourly.temperature_2m;

//   return (
//     <Card className="mb-3">
//       <Card.Body>
//         <h5>Today's Forecast</h5>
//         <Row>
//           {[15, 18, 21].map((hour) => (
//             <Col key={hour}>
//               <p>{hour}:00</p>
//               <p>{hourlyTemps[hour]}°C</p>
//             </Col>
//           ))}
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

// export default TodayForecast;

import React from "react";
import { FaTemperatureHigh } from "react-icons/fa"; // Icon for temperature
import { WiDaySunny } from "react-icons/wi"; // Icon for irradiance
import "./TodayForecast.css"; // Custom styling

const TodayForecast = ({ weatherData }) => {
  const currentHour = new Date().getHours();
  const hourly = weatherData.hourly;

  // Extract the next 24 hours starting from the current hour
  const next24Hours = hourly.time
    .slice(currentHour, currentHour + 24)
    .map((time, index) => {
      return {
        hour: (currentHour + index) % 24,
        temperature: hourly.temperature_2m[currentHour + index],
        irradiance: hourly.shortwave_radiation
          ? hourly.shortwave_radiation[currentHour + index]
          : null,
        weatherCode:
          hourly.weathercode - 1
            ? hourly.weathercode[currentHour + index]
            : null,
      };
    });

  return (
    <div className="today-forecast">
      <h4>Today’s 24-Hour Forecast</h4>
      <div className="hourly-forecast-container">
        {next24Hours.map((forecast, index) => (
          <div className="hour-box" key={index}>
            <div className="hour">{forecast.hour}:00</div>
            <div className="temperature">
              <FaTemperatureHigh /> {forecast.temperature}°C
            </div>
            <div className="irradiance">
              <WiDaySunny />{" "}
              {forecast.irradiance ? `${forecast.irradiance} W/m²` : "N/A"}
            </div>
            <div className="weather-icon">
              {/* Optional: Display weather icons based on weatherCode */}
              {forecast.weatherCode ? getWeatherIcon(forecast.weatherCode) : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to return an emoji based on weather code (optional)
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
    default:
      return "❓";
  }
};

export default TodayForecast;
