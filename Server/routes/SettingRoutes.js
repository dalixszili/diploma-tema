import express from "express";
import {
  createSettings,
  deleteSettings,
  getActiveYear,
  getSettings,
  getSettingsById,
  setActiveById,
  updateSettings,
} from "../controllers/SettingController.js";

const router = express.Router();
router.get("/settings", getSettings);
router.get("/activeyear", getActiveYear);
router.get("/settings/:id", getSettingsById);
router.post("/newsettings", createSettings);
router.patch("/updatesettings/:id", updateSettings);
router.patch("/deletesettings/:id", deleteSettings);
router.patch("/setactivesettings/:id", setActiveById);

export default router;
