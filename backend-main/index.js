import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/env.js";

import citizenRouter from "./routes/citizen.js";
import criminalRouter from "./routes/criminal.js";
import policeRouter from "./routes/police.js";
import complaintRouter from "./routes/complaint.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowList = ["http://localhost:5173", "http://localhost:5174"];

// middleware
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files (photos + evidence)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/citizen", citizenRouter);
app.use("/police", policeRouter);
app.use("/criminal", criminalRouter);
app.use("/complaint", complaintRouter);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server");
});


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : "Internal server error";
  console.error(error);
  return res.status(statusCode).json({ success: false, message });
});

app.listen(config.PORT, "0.0.0.0", () => {
  console.log("Server started on port", config.PORT);
});