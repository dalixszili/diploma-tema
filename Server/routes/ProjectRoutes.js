import express from "express";
import {
  createProject,
  deleteProject,
  getJudgeProjects,
  getProjectById,
  getProjects,
  getUserProjects,
  saveProjectFile,
  updateProject,
  updateProjectAbstract,
  updateProjectTitle,
} from "../controllers/ProjectController.js";
import {
  addAuthorToProject,
  deleteAuthor,
} from "../controllers/ProjectAuthorController.js";
import multer from "multer";
import {
  addTeacherToProject,
  deleteTeacher,
} from "../controllers/ProjectTeacherController.js";

// Projekt mentése
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/projects");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Invalid file type'));
  //   }
  // },
});

const router = express.Router();

router.get("/projects", getProjects);
router.get("/getuserprojects/:id", getUserProjects);
router.get("/getprojectbyid/:id", getProjectById);
router.get("/getprojectbyjudgecategory/:id", getJudgeProjects);
router.post("/newproject", createProject);
router.patch("/updateproject/:id", updateProject);
router.patch("/updateprojectabstract/:id", updateProjectAbstract);
router.patch("/updateprojecttitle/:id", updateProjectTitle);
router.post("/newprojectauthor", addAuthorToProject);
router.patch("/deleteprojectauthor", deleteAuthor);
router.post("/newprojectteacher", addTeacherToProject);
router.patch("/deleteprojectteacher", deleteTeacher);
router.patch("/deleteproject/:id", deleteProject);
router.post(
  "/saveprojectfile/:id",
  upload.single("project_file"),
  saveProjectFile
);

export default router;
