import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.post("/newcategory", createCategory);
router.patch("/updatecategory/:id", updateCategory);
router.patch("/deletecategory/:id", deleteCategory);

export default router;
