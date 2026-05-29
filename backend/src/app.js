import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// routes import
import sensorRoutes from "./routes/sensor.routes.js"; // Import rute sensor nanti

const app = express();

// Konfigurasi __dirname alternatif untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// 1. Sajikan folder frontend statis (Mundur 2 folder dari src)
app.use(express.static(path.join(__dirname, "../../frontend")));

// routes declaration
app.use("/api/v1/log", sensorRoutes);

// 3. Fallback Route: Kirim index.html jika user akses rute selain API
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
// });
// Menambahkan nama parameter setelah tanda bintang agar sesuai aturan modul baru
app.get("*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
});

export default app;
