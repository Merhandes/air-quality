import { Router } from "express";
import { getSensorRaw } from "../controllers/sensor.controllers.js";
import { getSensorMap } from "../controllers/sensor.map.controller.js";
import { getSensorHistorical } from "../controllers/sensor.historical.controller.js";

const router = Router();

// Menangani permintaan GET pada endpoint /api/v1/log
router.get("/", getSensorRaw);
router.get("/map", getSensorMap);
router.get("/historical", getSensorHistorical);

export default router;
