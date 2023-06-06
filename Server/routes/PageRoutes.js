import express from "express";
import {
  createPage,
  deletePage,
  getPageById,
  getPages,
  updatePage,
} from "../controllers/PageController.js";

const router = express.Router();

router.get("/pages", getPages);
router.get("/page/:id", getPageById);
router.post("/newpage", createPage);
router.patch("/updatepage/:id", updatePage);
router.patch("/deletepage/:id", deletePage);

export default router;
