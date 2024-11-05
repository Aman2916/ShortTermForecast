import axios from "axios";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_URL = "https://api.opencagedata.com/geocode/v1/json";

const localTime = new Date();
const utcHour = localTime.getUTCHours(); // Get current UTC hour
const timezoneOffset = localTime.getTimezoneOffset() / 60; // Offset in hours

// Adjust the hour index for your timezone
const localHourIndex = utcHour + timezoneOffset;
//const currentTemperature = weatherData.hourly.temperature_2m[localHourIndex];
export const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(OPEN_METEO_URL, {
      params: {
        latitude,
        longitude,
        hourly: "temperature_2m",
        daily:
          "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
        timezone: "auto",
      },
      timezone: "auto",
    });
    const hourlyTemperatures = response.data.hourly.temperature_2m; // Array of hourly temperatures
    const currentHour = new Date().getHours(); // Get current hour in local timezone

    // Ensure that the currentHour matches the hour in the hourlyTemperatures array
    const currentTemperature = hourlyTemperatures[currentHour];

    console.log("Current Temperature:", currentTemperature);

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const getCoordinates = async (cityName) => {
  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        q: cityName,
        key: "08260aa036494c0e9007d809ede7f0e8",
        limit: 1,
      },
    });
    const { lat, lng } = response.data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
