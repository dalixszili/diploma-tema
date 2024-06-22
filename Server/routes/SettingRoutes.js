import express from "express";
import {
  createSettings,
  deleteSettings,
  getActiveSettings,
  getSettings,
  getSettingsById,
  setActiveById,
  updateSettings,
} from "../controllers/SettingController.js";

const router = express.Router();
router.get("/settings", getSettings);
router.get("/activesettings", getActiveSettings);
router.get("/settings/:id", getSettingsById);
router.post("/newsettings", createSettings);
router.patch("/updatesettings/:id", updateSettings);
router.patch("/deletesettings/:id", deleteSettings);
router.patch("/setactivesettings/:id", setActiveById);

export default router;
