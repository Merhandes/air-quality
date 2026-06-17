import { Log } from "../models/log.model.js";

export const getSensorMap = async (req, res) => {
  try {
    const data = await Log.aggregate([
      { $sort: { timestamp: -1 } },

      {
        $group: {
          _id: {
            lat: "$latitude",
            lng: "$longitude",
          },
          latest: { $first: "$$ROOT" },
        },
      },

      {
        $replaceRoot: {
          newRoot: "$latest",
        },
      },

      { $sort: { timestamp: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Map data latest per coordinate",
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil map data",
      error: error.message,
    });
  }
};
