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
        )}&key=08260aa036494c0e9007d809ede7f0e8`
      );
      const data = await response.json();
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
    <Form className="d-flex mb-4">
      <Form.Control
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Button variant="primary" onClick={handleSearch}>
        Search
      </Button>
    </Form>
  );
};

export default SearchBar;
