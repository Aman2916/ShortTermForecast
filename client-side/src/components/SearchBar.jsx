import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  console.log("City:", city);
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city
        )}&key=${import.meta.env.VITE_OPENCAGED_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLatitude(lat);
        setLongitude(lng);
        onSearch(latitude, longitude);
      } else {
        console.error("No results found for this city.");
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
    }
  };

  //   const handleSearch = async () => {
  //     // Add logic here to convert city to latitude and longitude
  //     const latitude = 12.9716; // Replace with actual latitude from geocoding API
  //     const longitude = 77.5946; // Replace with actual longitude from geocoding API

  //
  //   };

  return (
    <Form className="flex bg-white/5 mb-4 rounded-2xl">
      <Form.Control
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="relative block flex-auto rounded-l-full border-[1.4px] border-white bg-white/5 px-3 py-[0.4rem] font-normal text-white outline-none focus:bg-white/5 focus:outline-none transition duration-200 placeholder:text-white"
      />
      <Button
        onClick={handleSearch}
        className="relative px-4 rounded-r-full border-[1.4px] border-l-0 border-white p-2 bg-transparent/40 text-white inset-0 backdrop-blur-md font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      >
        Start
      </Button>
    </Form>
  );
};

export default SearchBar;
