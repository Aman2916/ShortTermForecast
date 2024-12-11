// import React, { Suspense } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import SideBar from "./SideBar";
// import NavBar from "./NavBar";
// import { WeatherProvider } from "./WeatherContext";
// import BackgroundImage from "./components/Backgroundimage";

// const LazyLoadedWeather = React.lazy(() => import("./Weather"));
// const LazyLoadedServerIrradianceChart = React.lazy(() =>
//   import("./ServerIrradianceChart")
// );
// const LazyIndianSolarMap = React.lazy(() => import("./IndianSolarMap"));

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen">
//         <div className="w-full border-[1.5px] min-h-screen flex flex-col border-white rounded-2xl">
//           <BackgroundImage image={"url('/imgs/bg.jpg')"} />
//           <WeatherProvider>
//             <NavBar />
//             <MainLayout />
//           </WeatherProvider>
//         </div>
//       </div>
//     </Router>
//   );
// }

// function MainLayout() {
//   const location = useLocation();

//   const hideSidebarRoutes = [
//     "/weather",
//     "/historicaldata",
//     "/daily-irradiance",
//   ];
//   const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

//   return (
//     <div className="app-layout">
//       {!isSidebarHidden && <SideBar />}

//       <div className={`content ${isSidebarHidden ? "full-width" : ""}`}>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Routes>
//             <Route path="/weather" element={<LazyLoadedWeather />} />
//             <Route
//               path="/historicaldata"
//               element={<LazyLoadedServerIrradianceChart />}
//             />
//             <Route path="/daily-irradiance" element={<LazyIndianSolarMap />} />
//           </Routes>
//         </Suspense>
//       </div>
//     </div>
//   );
// }

// export default App;
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
import BackgroundImage from "./components/Backgroundimage";
import Login from "./Login"; // Importing the Login component

const LazyLoadedWeather = React.lazy(() => import("./Weather"));
const LazyLoadedServerIrradianceChart = React.lazy(() =>
  import("./ServerIrradianceChart")
);
const LazyIndianSolarMap = React.lazy(() => import("./IndianSolarMap"));

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <div className="w-full border-[1.5px] min-h-screen flex flex-col border-white rounded-2xl">
          <BackgroundImage image={"url('/imgs/bg.jpg')"} />
          <WeatherProvider>
            <NavBar />
            <MainLayout />
          </WeatherProvider>
        </div>
      </div>
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  const hideSidebarRoutes = [
    "/login", // Add login to hidden sidebar routes
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
            <Route path="/login" element={<Login />} /> {/* Add Login route */}
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
