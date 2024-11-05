import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
//import ; // Update the path to your GeoJSON file
import geoJson from "./ne_110m_admin_0_countries.json"; // Adjust the path accordingly

function InteractiveMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const width = 960;
    const height = 600;

    // Create the SVG element
    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define the projection (scale and center the map)
    const projection = d3
      .geoEquirectangular() // You can use other projections like geoOrthographic, geoEquirectangular, etc.
      .scale(100) // Adjust the scale based on your data
      .translate([width / 2, height / 2]); // Center the map

    // Create a path generator using the projection
    const path = d3.geoPath().projection(projection);

    // Add zoom and pan
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Render the GeoJSON data (the map)
    svg
      .append("g")
      .selectAll("path")
      .data(geoJson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#6565ff") // Fill color for the regions
      .attr("stroke", "#333"); // Border color

    // Optional: Add interactivity (hover, click)
    svg
      .selectAll("path")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#6565ff"); // Change color on hover
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#d9d9d9"); // Revert to original color
      })
      .on("click", function (event, d) {
        alert(`You clicked on: ${d.properties.SOVEREIGNT}`); // Display the region name (if available in the properties)
      });
  }, []);

  return <div ref={mapRef}></div>;
}

export default InteractiveMap;
