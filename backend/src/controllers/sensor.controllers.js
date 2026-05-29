import { Log } from "../models/log.model.js";

const getSensorRaw = async (req, res) => {
  try {
    // Mengambil 20 data sensor terbaru, diurutkan berdasarkan waktu terbaru (descending)
    const data = await Log.find().sort({ timestamp: -1 });

    // Kirim respons sukses dalam bentuk JSON
    return res.status(200).json({
      success: true,
      message: "Data sensor berhasil diambil",
      count: data.length,
      data: data,
    });
  } catch (error) {
    // Tangani jika terjadi error koneksi atau pembacaan database
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data sensor",
      error: error.message,
    });
  }
};

export { getSensorRaw };
