import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { WeatherProvider } from "./WeatherContext";

const LazyLoadedWeather = React.lazy(() => import("./Weather"));
const LazyLoadedServerIrradianceChart = React.lazy(() =>
  import("./ServerIrradianceChart")
);
const LazyIndianSolarMap = React.lazy(() => import("./IndianSolarMap"));

function App() {
  return (
    <Router>
      <WeatherProvider>
        <NavBar />
        <MainLayout />
      </WeatherProvider>
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  const hideSidebarRoutes = [
    "/weather",
    "/historicaldata",
    "/daily-irradiance",
  ];
  const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      {!isSidebarHidden && <SideBar />}

      <div className={`content ${isSidebarHidden ? "full-width" : ""}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/weather" element={<LazyLoadedWeather />} />
            <Route
              path="/historicaldata"
              element={<LazyLoadedServerIrradianceChart />}
            />
            <Route path="/daily-irradiance" element={<LazyIndianSolarMap />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
