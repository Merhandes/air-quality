require(/backend/MQTT/mqtt); // Jalankan MQTT bridge saat server Express dimulai');

const express = require("express");
const path = require("path");
const app = express();


// 1. Sajikan file statis dari hasil build frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 2. Rute API Anda di sini
app.get("/api/data", (req, res) => {
  res.json({ message: "Halo dari backend Express!" });
});

// 3. Alihkan semua rute sisa ke frontend (penting untuk React Router/Vue Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// 4. Pastikan port menggunakan variabel lingkungan dari Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
