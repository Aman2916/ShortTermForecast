import React from "react";
// import "./DailyForecast.css";

const DailyForecast = ({ dailyData }) => {
  return (
    <div className="daily-forecast">
      {dailyData.temperature_2m_max.map((temp, index) => (
        <div key={index} className="day-box">
          <p>Day {index + 1}</p>
          <p>Max: {temp}°C</p>
          <p>Min: {dailyData.temperature_2m_min[index]}°C</p>
        </div>
      ))}
    </div>
  );
};

export default DailyForecast;
