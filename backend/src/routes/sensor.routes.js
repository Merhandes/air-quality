import express from "express";
import { getSensorData } from "../controllers/sensor.controllers.js";

const router = express.Router();

// Menangani permintaan GET pada endpoint /api/sensor
router.route("/").get(getSensorData);

export default router;
