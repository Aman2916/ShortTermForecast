# Solar Forecasting & PV Power Prediction App

Predicts solar irradiance (DNI, DHI, GHI) and photovoltaic (PV) power generation based on weather forecasts.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project provides accurate short-term solar irradiance (DNI, DHI, GHI) and PV power forecasts using real-time weather data and advanced modeling. The system is designed for solar plant owners, researchers, and enthusiasts who want to optimize PV output predictions.

## Features

- Interactive web dashboard for visualizing solar and PV data
- Real-time and forecasted weather & irradiance inputs
- Accurate PV power prediction using PVlib
- Data storage and retrieval for historical analysis
- Responsive UI for desktop and mobile

## Screenshots

Below are some screenshots demonstrating the application's features and interface:

**Dashboard: Global Solar Irradiance**
![image1](image1)

**Current Weather and Weekly Forecast**
![image2](image2)

**Solar Irradiance Data Visualization (GHI)**
![image3](image3)

**Solar Irradiance Data Visualization (DHI)**
![image4](image4)

## Technologies Used

**Frontend:**
- React.js — interactive user interfaces
- D3.js — data visualization (solar irradiance & power)
- Bootstrap — UI components

**Backend:**
- Node.js — server-side logic
- Express.js — API endpoints
- MongoDB — database for weather & solar data

**External Data/APIs:**
- OpenMeteo — weather data
- PVGIS or Solcast — solar irradiance forecast

**Modeling/Simulation:**
- PVlib — PV power output simulation

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aman2916/ShortTermForecast.git
   cd ShortTermForecast
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client-side
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root and configure MongoDB URI & API keys as needed.
   - Example:
     ```
     MONGODB_URI=your_mongodb_connection_string
     OPENMETEO_API_KEY=your_api_key
     ```

5. **Run the backend server:**
   ```bash
   npm start
   ```

6. **Run the frontend app:**
   ```bash
   cd client-side
   npm run dev
   ```

## Usage

- Access the frontend at `http://localhost:5173/` (or as shown in your console).
- Use the dashboard to:
  - Set your location and forecast parameters
  - View interactive solar irradiance & PV power graphs
  - Analyze historical and forecasted data

## Project Structure

```
ShortTermForecast/
├── client-side/        # React frontend (Vite-based)
├── models/             # Mongoose DB models
├── routes/             # Express.js API routes
├── services/           # External API and simulation logic
├── .env.example        # Example environment variables
├── README.md           # Project documentation
└── ...
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for feature requests, bug fixes, or improvements.

1. Fork the repo and create your branch.
2. Make your changes and add tests as needed.
3. Submit a pull request describing your changes.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Inspired by the need for better PV forecasting and solar optimization.*
