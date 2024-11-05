import React, { useState, useEffect } from "react";
import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl";
import { Card, Form, Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MapboxIndiaSolar = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
  });
  const [solarData, setSolarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Extended list of cities with their coordinates and connections
  const cities = [
    {
      name: "Mumbai",
      lat: 19.076,
      lon: 72.8777,
      connections: ["Indore", "Hyderabad"],
    },
    {
      name: "Delhi",
      lat: 28.6139,
      lon: 77.209,
      connections: ["Indore", "Jaipur"],
    },
    {
      name: "Bangalore",
      lat: 12.9716,
      lon: 77.5946,
      connections: ["Chennai", "Hyderabad"],
    },
    {
      name: "Chennai",
      lat: 13.0827,
      lon: 80.2707,
      connections: ["Bangalore", "Hyderabad"],
    },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639, connections: ["Guwahati"] },
    {
      name: "Hyderabad",
      lat: 17.385,
      lon: 78.4867,
      connections: ["Mumbai", "Chennai", "Bangalore"],
    },
    {
      name: "Indore",
      lat: 22.7196,
      lon: 75.8577,
      connections: ["Mumbai", "Delhi", "Jaipur"],
    },
    { name: "Guwahati", lat: 26.1445, lon: 91.7362, connections: ["Kolkata"] },
    {
      name: "Jaipur",
      lat: 26.9124,
      lon: 75.7873,
      connections: ["Delhi", "Indore"],
    },
  ];

  const prepareChartData = () => {
    if (!selectedCity || !solarData[selectedCity]) return [];

    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      irradiance: solarData[selectedCity][i] || 0,
      isCurrentHour: i === currentHour,
    }));
  };

  const generateConnections = () => {
    const features = [];
    const addedConnections = new Set();

    cities.forEach((city) => {
      city.connections.forEach((connectedCityName) => {
        const connectedCity = cities.find((c) => c.name === connectedCityName);
        if (connectedCity) {
          const connectionId = [city.name, connectedCityName].sort().join("-");
          if (!addedConnections.has(connectionId)) {
            features.push({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [city.lon, city.lat],
                  [connectedCity.lon, connectedCity.lat],
                ],
              },
            });
            addedConnections.add(connectionId);
          }
        }
      });
    });

    return {
      type: "FeatureCollection",
      features,
    };
  };

  const connectionsLayer = {
    id: "connections",
    type: "line",
    paint: {
      "line-color": "#4a5568",
      "line-width": 1.5,
      "line-opacity": 0.6,
    },
  };

  useEffect(() => {
    const fetchSolarData = async () => {
      setLoading(true);
      const now = new Date();
      const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const endDate = now;

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const fetchPromises = cities.map(async (city) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=shortwave_radiation&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          return {
            city: city.name,
            data: data.hourly.shortwave_radiation.slice(-24),
          };
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error);
          return {
            city: city.name,
            data: new Array(24).fill(0),
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      const solarDataMap = {};
      results.forEach((result) => {
        solarDataMap[result.city] = result.data;
      });

      setSolarData(solarDataMap);
      setLoading(false);
    };

    fetchSolarData();
  }, []);

  const getColor = (value) => {
    const maxIrradiance = 1000;
    const ratio = value / maxIrradiance;

    if (ratio < 0.2) return "#2C5282";
    if (ratio < 0.3) return "#4299E1";
    if (ratio < 0.4) return "#F6E05E";
    if (ratio < 0.5) return "#ED8936";
    return "#C53030";
  };

  const getCircleSize = (value) => {
    const baseSize = 24;
    const maxSize = 48;
    const minSize = 24;
    const maxIrradiance = 1000;

    const sizeRange = maxSize - minSize;
    const normalizedValue = Math.min(value / maxIrradiance, 0.7);
    return sizeRange * normalizedValue;
  };

  return (
    <Container fluid className="p-3">
      <Row>
        <Col md={8}>
          <Card bg="dark" text="white" className="mb-3">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">India Solar Irradiance Network</h4>
                  <small className="text-muted">
                    Circle size indicates irradiance level
                  </small>
                </Col>
                <Col xs="auto" className="d-flex align-items-center gap-2">
                  <span>{currentHour}:00</span>
                  <Form.Range
                    min={0}
                    max={23}
                    value={currentHour}
                    onChange={(e) => setCurrentHour(parseInt(e.target.value))}
                    style={{ width: "200px" }}
                  />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  position: "relative",
                  height: "600px",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Spinner animation="border" variant="light" />
                  </div>
                ) : (
                  <Map
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    mapboxAccessToken="pk.eyJ1IjoiYW1hbjI5MTYiLCJhIjoiY20yejBsbXNvMDViZjJqczNmNW4xbnRsOSJ9.3u92kYPA5pTdGFsaFtvRmA"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {/* Connection lines */}
                    <Source type="geojson" data={generateConnections()}>
                      <Layer {...connectionsLayer} />
                    </Source>

                    {/* City markers */}
                    {cities.map((city, index) => {
                      const cityData = solarData[city.name] || [];
                      const currentValue = cityData[currentHour] || 0;
                      const isHovered = hoveredCity === city.name;
                      const isSelected = selectedCity === city.name;
                      const circleSize = getCircleSize(currentValue);

                      return (
                        <Marker
                          key={index}
                          longitude={city.lon}
                          latitude={city.lat}
                          anchor="center"
                        >
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                            onMouseEnter={() => setHoveredCity(city.name)}
                            onMouseLeave={() => setHoveredCity(null)}
                            onClick={() => setSelectedCity(city.name)}
                          >
                            <div
                              style={{
                                width: `${circleSize}px`,
                                height: `${circleSize}px`,
                                borderRadius: "50%",
                                backgroundColor: getColor(currentValue),
                                border: `2px solid ${
                                  isSelected ? "#F6E05E" : "white"
                                }`,
                                cursor: "pointer",
                                transition: "all 300ms",
                                transform:
                                  isHovered || isSelected
                                    ? "scale(1.1)"
                                    : "scale(1)",
                                boxShadow:
                                  isHovered || isSelected
                                    ? "0 0 15px rgba(255,255,255,0.5)"
                                    : "none",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: `${circleSize + 8}px`,
                                textAlign: "center",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "white",
                                textShadow: "0 0 4px rgba(0,0,0,0.8)",
                                backgroundColor: "rgba(0,0,0,0.6)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                pointerEvents: "none",
                              }}
                            >
                              {city.name}
                            </div>
                            {isHovered && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: `-${circleSize / 2 + 30}px`,
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "14px",
                                  whiteSpace: "nowrap",
                                  zIndex: 1000,
                                }}
                              >
                                Irradiance: {currentValue.toFixed(1)} W/m²
                              </div>
                            )}
                          </div>
                        </Marker>
                      );
                    })}

                    <NavigationControl position="top-right" />
                  </Map>
                )}

                {/* Legend */}
                <Card
                  bg="dark"
                  text="white"
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    background: "rgba(33, 37, 41, 0.9)",
                  }}
                >
                  <Card.Body className="p-2">
                    <div className="mb-2">Solar Irradiance (W/m²):</div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#2C5282",
                            borderRadius: "50%",
                          }}
                        />
                        <span>0-200</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#4299E1",
                            borderRadius: "50%",
                          }}
                        />
                        <span>200-400</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#F6E05E",
                            borderRadius: "50%",
                          }}
                        />
                        <span>400-600</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            backgroundColor: "#ED8936",
                            borderRadius: "50%",
                          }}
                        />
                        <span>600-800</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#C53030",
                            borderRadius: "50%",
                          }}
                        />
                        <span>800-1000</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="dark" text="white" className="h-100">
            <Card.Header>
              <h5 className="mb-0">24-Hour Irradiance Data</h5>
              <small className="text-muted">
                {selectedCity
                  ? `Showing data for ${selectedCity}`
                  : "Select a city to view data"}
              </small>
            </Card.Header>
            <Card.Body>
              {selectedCity ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={prepareChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: "white" }}
                      tickFormatter={(hour) => `${hour}:00`}
                    />
                    <YAxis
                      tick={{ fill: "white" }}
                      label={{
                        value: "Irradiance (W/m²)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "white",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#343a40",
                        border: "none",
                      }}
                      labelStyle={{ color: "white" }}
                      formatter={(value) => [
                        `${value.toFixed(1)} W/m²`,
                        "Irradiance",
                      ]}
                      labelFormatter={(hour) => `${hour}:00`}
                    />
                    <Bar
                      dataKey="irradiance"
                      fill={(data) =>
                        data.isCurrentHour ? "#F6E05E" : "#4299E1"
                      }
                      animationDuration={300}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="text-center text-muted h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "white" }}
                >
                  Click on a city to view its 24-hour irradiance data
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MapboxIndiaSolar;
