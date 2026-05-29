import { Log } from "../models/log.model.js";

export const getSensorHistorical = async (req, res) => {
  try {
    const { lat, lng, limit = 100 } = req.query;

    const match = {};

    if (lat && lng) {
      match.latitude = Number(lat);
      match.longitude = Number(lng);
    }

    const data = await Log.aggregate([
      // FILTER KOORDINAT
      {
        $match: match,
      },

      // FORMAT TANGGAL
      {
        $addFields: {
          dateOnly: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp",
            },
          },
        },
      },

      // GROUP PER HARI
      {
        $group: {
          _id: "$dateOnly",

          avgPm25: {
            $avg: "$pm2_5",
          },

          maxPm25: {
            $max: "$pm2_5",
          },

          totalData: {
            $sum: 1,
          },
        },
      },

      // SORT
      {
        $sort: {
          _id: 1,
        },
      },

      // LIMIT
      {
        $limit: Number(limit),
      },
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil historical data",
      error: error.message,
    });
  }
};
