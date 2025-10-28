const express = require("express");
const cors = require("cors");
require("dotenv").config();

const skillRoutes = require("./routes/skillRoutes");
const integrationRoutes = require("./routes/integrationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", skillRoutes);
app.use("/api", integrationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`SkillForge API running on port ${PORT}`);
});
