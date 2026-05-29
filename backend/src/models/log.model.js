import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
  {
    pm1_0: Number,
    pm2_5: Number,
    pm10_0: Number,
    temperature: Number,
    humidity: Number,
    co2: Number,
    latitude: Number,
    longitude: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // UBAH KE SINI: Mengunci agar Mongoose membaca collection 'monitoring_udara'
    collection: "logs",
  }
);

export const Log = mongoose.model("Log", logSchema);
