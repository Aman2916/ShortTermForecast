const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const PORT = 5000;
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(bodyParser.json());
let data = [];

fs.createReadStream("merged_preprocessed_datas1.csv")
  .pipe(csv())
  .on("data", (row) => {
    const date = new Date(row.period_end);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    data.push({ ...row, year, month });
  })
  .on("end", () => {
    console.log("CSV file processed");
  });

app.get("/api/irradiance", (req, res) => {
  const { city, year, month, target } = req.query;
  console.log("Parameters received:", city, year, month, target);

  if (!year || !target) {
    return res.status(400).json({
      error:
        "Missing required parameters: city, year, and target are required.",
    });
  }

  let filteredData = data;
  if (city) filteredData = filteredData.filter((d) => d.city_id === city);
  if (year)
    filteredData = filteredData.filter((d) => d.year === parseInt(year));
  if (month)
    filteredData = filteredData.filter((d) => d.month === parseInt(month));
  if (target) {
    filteredData = filteredData.map((d) => ({
      date: d.period_end,
      value: d[target],
    }));
  }

  res.json(filteredData);
  console.log(filteredData);
});

//app.use(cors({ origin: "http://localhost:5173" }));

app.post("/api/predict", (req, res) => {
  const inputFeatures = req.body;
  //console.log(inputFeatures[0]);
  if (!Array.isArray(inputFeatures) || inputFeatures.length === 0) {
    return res.status(400).json({
      error: "Invalid input data. Expected an array of feature sets.",
    });
  }

  const pythonProcess = spawn("python", ["predict.py"]);

  let result = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    console.log("Python output:", data.toString()); // Debug log
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString()); // Debug log
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      res.status(500).json({ error: error });
    } else {
      try {
        const parsedResult = JSON.parse(result);
        console.log("Parsed Result:", parsedResult);
        res.json(parsedResult);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        res.status(500).json({ error: "Invalid JSON from Python script" });
      }
    }
  });

  pythonProcess.stdin.write(JSON.stringify(inputFeatures));
  pythonProcess.stdin.end();
});

mongoose
  .connect("mongodb://localhost:27017/userDB", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Plain password for demo
});

const User = mongoose.model("User", userSchema);

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password }); // Plain match for demo
    if (user) {
      res.status(200).json({ msg: "Login successful" });
    } else {
      res.status(401).json({ msg: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
