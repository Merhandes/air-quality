import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// routes import
import sensorRoutes from "./routes/sensor.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, "../../frontend")));

app.use("/api/v1/log", sensorRoutes);

app.get("*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
});

export default app;
