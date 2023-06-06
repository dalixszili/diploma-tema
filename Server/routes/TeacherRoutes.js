import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  updateTeacher,
} from "../controllers/TeacherController.js";

const router = express.Router();

router.post("/newteacher", createTeacher);
router.get("/teacher/:id", getTeacherById);
router.patch("/updateteacher/:id", updateTeacher);
router.patch("/deleteteacher/:id", deleteTeacher);

export default router;
