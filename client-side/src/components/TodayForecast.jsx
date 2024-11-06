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
    <div className="p-[15px] rounded-xl border-[1.5px] border-white/5">
      <h2 className="font-bold text-green-500 text-lg">
        Today's 24-Hour Forecast
      </h2>
      <div className="hourly-forecast-container flex px-3 py-2 overflow-x-scroll">
        {next24Hours.map((forecast, index) => (
          <div
            className={`hour-box flex flex-col min-w-[100px] bg-white/5 rounded-lg p-2 mr-3 ${
              currentHour == forecast.hour ? "border-2 border-yellow-500" : ""
            } text-center text-white text-sm font-[14px] justify-center items-center gap-2`}
            key={index}
          >
            <div className="flex font-bold text-center items-center text-teal-400 justify-center">
              {forecast.hour}:00
            </div>
            <div className="flex temperature text-center items-center text-orange-400 justify-center gap-1">
              <FaTemperatureHigh /> {forecast.temperature}°C
            </div>
            <div className="irradiance flex text-center items-center font-bold text-red-500 justify-center gap-1">
              <WiDaySunny className="text-2xl" />{" "}
              {forecast.irradiance ? `${forecast.irradiance} W/m²` : "N/A"}
            </div>
            <div className="weather-icon flex">
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
