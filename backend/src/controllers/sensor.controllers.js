import { Log } from "../models/log.model.js";

const getSensorRaw = async (req, res) => {
  try {
    const data = await Log.find().sort({ timestamp: -1 });

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

export { getSensorRaw };
