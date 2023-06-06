import express from "express";
import {
  createSponsor,
  deleteSponsor,
  getSponsorById,
  getSponsorsByOrder,
  setOrderById,
  updateSponsor,
  upload,
} from "../controllers/SponsorsController.js";
const router = express.Router();

router.get("/sponsors", getSponsorsByOrder);
router.get("/sponsors/:id", getSponsorById);
router.post("/newsponsor", upload.single("logo_file"), createSponsor);
router.post("/updatesponsor/:id", upload.single("logo_file"), updateSponsor);
router.patch("/deletesponsor/:id", deleteSponsor);
router.patch("/sponsors/setorder/:id", setOrderById);

export default router;
