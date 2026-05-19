import Log from "../models/log.model.js";

const getSensorData = async (req, res) => {
  try {
    // Cukup panggil model Mongoose langsung. Mongoose sudah otomatis terhubung secara global via index.js
    const data = await Log.find().sort({ timestamp: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      message: "Data sensor berhasil diambil",
      count: data.length,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data sensor",
      error: error.message,
    });
  }
};

export { getSensorData };
