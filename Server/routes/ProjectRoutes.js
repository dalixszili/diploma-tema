import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
} from "../controllers/ProjectController.js";
import { addAuthorToProject } from "../controllers/ProjectAuthorController.js";

const router = express.Router();

router.get("/projects", getProjects);
router.post("/newproject", createProject);
router.patch("/updateproject/:id", updateProject);

router.post("/newprojectauthor", addAuthorToProject);

export default router;
