import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sensorRoutes from "./routes/sensor.routes.js"; // Import rute sensor nanti

const app = express();

// Konfigurasi __dirname alternatif untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// 1. Sajikan folder frontend statis (Mundur 2 folder dari src)
app.use(express.static(path.join(__dirname, "../../frontend")));

// 2. Daftarkan Rute API Anda
app.use("/api/sensor", sensorRoutes);

// 3. Fallback Route: Kirim index.html jika user akses rute selain API
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
// });
// Menambahkan nama parameter setelah tanda bintang agar sesuai aturan modul baru
app.get("*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
});

export default app;
