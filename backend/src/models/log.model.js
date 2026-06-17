import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
  {
    device_id: {
      type: String,
      required: true,
      index: true,
    },
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
    collection: "logs",
  }
);

export const Log = mongoose.model("Log", logSchema);
