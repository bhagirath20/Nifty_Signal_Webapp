// Simplified server.js file for Vercel deployment
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// In-memory storage for development/testing
let signalsMemory = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Webhook endpoint for TradingView alerts
app.post("/webhook", async (req, res) => {
  try {
    const signal = req.body;

    // Add timestamp
    signal.receivedAt = new Date().toISOString();

    // Store in memory (will be lost on serverless function cold starts)
    signalsMemory.unshift(signal);

    // Keep only the most recent 100 signals
    if (signalsMemory.length > 100) {
      signalsMemory = signalsMemory.slice(0, 100);
    }

    console.log("Signal received:", signal);
    res
      .status(200)
      .json({ success: true, message: "Signal received and stored" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: "Error processing signal",
      error: error.message,
    });
  }
});

// API to get all signals
app.get("/api/signals", async (req, res) => {
  try {
    res.json(signalsMemory);
  } catch (error) {
    console.error("Error retrieving signals:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving signals" });
  }
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server when running locally
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
module.exports = app;

// // server.js - Main server file
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const fs = require("fs").promises;
// const path = require("path");
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // Data storage file path
// const dataFilePath = path.join(process.cwd(), "data", "signals.json");

// // Ensure data directory exists
// async function ensureDataDirectoryExists() {
//   const dir = path.join(process.cwd(), "data");
//   try {
//     await fs.mkdir(dir, { recursive: true });
//   } catch (err) {
//     if (err.code !== "EEXIST") throw err;
//   }
// }

// // Load existing data
// async function loadData() {
//   try {
//     await ensureDataDirectoryExists();
//     const data = await fs.readFile(dataFilePath, "utf8");
//     return JSON.parse(data);
//   } catch (err) {
//     if (err.code === "ENOENT") {
//       // File doesn't exist yet, create with empty array
//       await fs.writeFile(dataFilePath, JSON.stringify([]), "utf8");
//       return [];
//     }
//     throw err;
//   }
// }

// // Save data
// async function saveData(data) {
//   await ensureDataDirectoryExists();
//   await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
// }

// // Webhook endpoint for TradingView alerts
// app.post("/webhook", async (req, res) => {
//   try {
//     const signal = req.body;

//     // Add timestamp
//     signal.receivedAt = new Date().toISOString();

//     // Load existing data
//     const data = await loadData();

//     // Add new signal to data array
//     data.unshift(signal); // Add to beginning for chronological order

//     // Limit to last 100 signals to prevent file growth
//     const limitedData = data.slice(0, 100);

//     // Save updated data
//     await saveData(limitedData);

//     res
//       .status(200)
//       .json({ success: true, message: "Signal received and stored" });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error processing signal" });
//   }
// });

// // API to get all signals
// app.get("/api/signals", async (req, res) => {
//   try {
//     const data = await loadData();
//     res.json(data);
//   } catch (error) {
//     console.error("Error retrieving signals:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error retrieving signals" });
//   }
// });

// // Serve the main page
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // Start server
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
//   });
// }

// // Export for Vercel
// module.exports = app;
