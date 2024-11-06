import React from "react";
import { Card } from "react-bootstrap";

const AirConditions = ({ weatherData }) => {
  console.log(weatherData);
  const windSpeed = weatherData.hourly.wind_speed_10m[new Date().getHours()];
  const humidity =
    weatherData.hourly.relative_humidity_2m[new Date().getHours()];
  const cloudCover = weatherData.hourly.cloud_cover_mid[new Date().getHours()];

  return (
    <div className="mb-3 text-white p-2">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="font-bold text-xl text-green-500">Air Conditions</h2>
        <div className="flex gap-20">
          <div className="flex flex-col gap-1 items-center">
            <p className="text-yellow-300">Real Feel </p>
            <p>
              {weatherData.hourly.apparent_temperature[new Date().getHours()]}°C
            </p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <p className="text-yellow-300">Wind Speed</p>
            <p> {windSpeed} m/s</p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <p className="text-yellow-300">Clouds</p>
            <p> {cloudCover}%</p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <p className="text-yellow-300">Humidity</p>
            <p> {humidity}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirConditions;
