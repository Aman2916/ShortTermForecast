import React from "react";
import { Card } from "react-bootstrap";

const AirConditions = ({ weatherData }) => {
  console.log(weatherData);
  const windSpeed = weatherData.hourly.wind_speed_10m[new Date().getHours()];
  const humidity =
    weatherData.hourly.relative_humidity_2m[new Date().getHours()];
  const cloudCover = weatherData.hourly.cloud_cover_mid[new Date().getHours()];

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Air Conditions</h5>
        <p>
          Real Feel:{" "}
          {weatherData.hourly.apparent_temperature[new Date().getHours()]}°C
        </p>
        <p>Wind Speed: {windSpeed} m/s</p>
        <p>Clouds: {cloudCover}%</p>
        <p>Humidity: {humidity}%</p>
      </Card.Body>
    </Card>
  );
};

export default AirConditions;
