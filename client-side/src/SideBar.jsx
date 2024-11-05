import React from "react";
import { Container, Row, Col, Nav, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChartBar, faCog } from "@fortawesome/free-solid-svg-icons";
import "./App.scss";
import InteractiveMap from "./svg.jsx";
import WorldMap from "./WorldMap";
import { Link } from "react-router-dom";
//import WeatherIrradiance from "./WeatherIrradiance";
import ServerIrradianceChart from "./ServerIrradianceChart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./Weather"; // Weather component

function SideBar() {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar Column */}
        <Col xs={2} className="p-0">
          <div
            className="sidebar vh-100 p-3"
            style={{ backgroundColor: "#17193b" }}
          >
            <h5 className="text-white mb-4">
              <FontAwesomeIcon className="me-2" icon={faHome} />
              Dashboard
            </h5>
            <Nav className="flex-column">
              <Nav.Item className="mb-3">
                <Nav.Link href="/weather" className="sidebar-item text-white">
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  <Link to="/weather">Weather</Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link
                  href="/historicaldata"
                  className="sidebar-item text-white"
                >
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />{" "}
                  <Link to="/historicaldata">Historical Data</Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link href="/settings" className="sidebar-item text-white">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  <Link to="/daily-irradiance">Daily Visualization</Link>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>

        {/* Main Content Column */}
        <Col
          xs={10}
          className="content-area"
          style={{ backgroundColor: "#17193b" }}
        >
          <div className="p-4" style={{ color: "grey" }}>
            <h2>Global Solar Irradiance </h2>
            <WorldMap />

            {/* You can add more content here */}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SideBar;
